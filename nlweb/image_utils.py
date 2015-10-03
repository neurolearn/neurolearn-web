import os
import shutil
import logging

import numpy as np
import nibabel as nb
import requests

from nilearn.masking import compute_background_mask, _extrapolate_out_mask
from nilearn.image import resample_img

import nltools

from .httpclient import FileCache, CachedObject

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


BASE_NV_URL = 'http://neurovault.org'


class ImageResampler(object):

    def __init__(self, cache):
        self.cache = cache

    def process(self, source_file, output_file, target_nii, cache_key):

        # XXX: Cache direct access to speed things up during development
        cached_dir = self.cache.get_dirpath(cache_key)

        if cached_dir:
            shutil.copyfile(os.path.join(cached_dir, 'data'), output_file)
            return output_file

        resampled = self._resample_image(source_file, output_file, target_nii)
        with open(resampled, 'r') as f:
            self.cache.set(cache_key, CachedObject(
                headers={},
                data=f.read()))
        return resampled

    def _resample_image(self, image_file, output_file, target_nii):
        # Compute the background and extrapolate outside of the mask
        log.info("Extrapolating %s", image_file)

        niimg = nb.load(image_file)
        affine = niimg.get_affine()
        data = niimg.get_data().squeeze()
        niimg = nb.Nifti1Image(data, affine, header=niimg.get_header())
        bg_mask = compute_background_mask(niimg).get_data()

        # Test if the image has been masked:
        out_of_mask = data[np.logical_not(bg_mask)]
        if np.all(np.isnan(out_of_mask)) or len(np.unique(out_of_mask)) == 1:
            # Need to extrapolate
            data = _extrapolate_out_mask(data.astype(np.float),
                                         bg_mask, iterations=3)[0]
        niimg = nb.Nifti1Image(data, affine, header=niimg.get_header())
        del out_of_mask, bg_mask

        log.info("Resampling %s", image_file)
        resampled_nii = resample_img(
            niimg, target_nii.get_affine(), target_nii.shape)
        resampled_nii = nb.Nifti1Image(resampled_nii.get_data().squeeze(),
                                       resampled_nii.get_affine(),
                                       header=niimg.get_header())
        if len(resampled_nii.shape) == 3:
            resampled_nii.to_filename(output_file)
        else:
            # We have a 4D file
            raise Exception('4D File.')
            # assert len(resampled_nii.shape) == 4
            # resampled_data = resampled_nii.get_data()
            # affine = resampled_nii.get_affine()
            # for index in range(resampled_nii.shape[-1]):
            #     # First save the files separately
            #     this_nii = nb.Nifti1Image(resampled_data[..., index], affine)
            #     this_id = int("%i%i" % (-row[1]['image_id'], index))
            #     this_file = os.path.join(output_dir, "%06d%s" % (this_id, ext))
            #     this_nii.to_filename(this_file)
            #     # Second, fix the dataframe
            #     out_df = out_df[out_df.image_id != row[1]['image_id']]
            #     this_row = row[1].copy()
            #     this_row.image_id = this_id
            #     out_df = out_df.append(this_row)
        return output_file


def image_id(url):
    return int(url.split("/")[-2])


def local_filepath(dirname, collection_id, filename):
    return os.path.join(dirname, "%s_%s" % (collection_id, filename))


def fetch_collection_images(collection_id):
    url = "%s/api/collections/%s/images/"

    r = requests.get(url % (BASE_NV_URL, collection_id))

    return r.json()


def fetch_collection(collection_id):
    url = "%s/api/collections/%s/"

    r = requests.get(url % (BASE_NV_URL, collection_id))

    return r.json()


def image_media_url(image):
    media_url = image.get('media_url')

    if not media_url:
        media_url = "%s/media/images/%s/%s" % (
            BASE_NV_URL,
            image['collection_id'],
            image['filename']
        )

    return media_url


def collection_to_mapping(key, collection):
    return {item[key]: item for item in collection}


def collection_ids(image_list):
    return set([x.get('collection_id') for x in image_list])


def media_url_from_collection(collection_images, image):
    return collection_images[image['collection_id']][image['id']]['file']


def download_images(client, image_list, output_dir):
    """
    :param client: An instance of nlweb.HTTPClient
    :param image_list: A list of dictionaries with image data
    """
    dirname = os.path.join(output_dir, 'original')
    try:
        os.makedirs(dirname)
    except (IOError, OSError):
        pass

    has_filenames = all([x.get('filename') for x in image_list])

    if not has_filenames:
        collection_images = {
            id: collection_to_mapping('id',
                                      fetch_collection_images(id)['results'])
            for id in collection_ids(image_list)
        }

        for image in image_list:
            image['media_url'] = media_url_from_collection(collection_images,
                                                           image)

    image_items = []

    for image in image_list:
        media_url = image_media_url(image)
        key = (image['filename']
               if has_filenames else os.path.basename(media_url))

        log.info("Retrieving %s from collection #%s",
                 key,
                 image['collection_id'])
        image_items.append(dict(
            original_file=client.retrieve(
                media_url,
                local_filepath(
                    dirname,
                    image['collection_id'],
                    key),
                force_cache=True),
            **image))

    return image_items


def resample_images(image_list, output_dir):
    """
    :param image_list: A list of dictionaries of the form
                       {
                           'collection_id': '42',
                           'filename': 'file.nii.gz'
                           'original_file': 'path/to/the/original/file.nii.gz'
                       }
    """
    dirname = os.path.join(output_dir, 'resampled')
    target_nii_filename = 'MNI152_T1_2mm_brain_mask.nii.gz'
    standard = os.path.join(
        os.path.dirname(nltools.__file__), 'resources',
        target_nii_filename)

    target_nii = nb.load(standard)

    try:
        os.makedirs(dirname)
    except (IOError, OSError):
        pass

    image_items = []
    resampler = ImageResampler(cache=FileCache('cache'))

    for image in image_list:
        filename = os.path.join(dirname,
                                os.path.basename(image['original_file']))
        key = 'resample://images/{collection_id}/{id}/?target={target_nii}'.format(
            target_nii=target_nii_filename,
            **image
        )

        log.info("Getting Resampled Image for %s", filename)
        image_items.append(dict(
            resampled_file=resampler.process(
                image['original_file'],
                filename,
                target_nii=target_nii,
                cache_key=key
            ),
            **image))

    return image_items
