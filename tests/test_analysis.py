import os
import nibabel as nib

from nlweb import analysis

from nlweb.httpclient import HTTPClient, FileCache
from nlweb.image_utils import (download_images, resample_images,
                               fetch_collection_images)

from .nv_test_data import TARGET_DATA


def compare_image_files(img_a, img_b):
    assert img_a.get_data().shape == img_b.get_data().shape
    assert (img_a.get_data() == img_b.get_data()).all()


def test_train_model(tmpdir):
    algorithm = 'ridge'
    output_dir = str(tmpdir)

    client = HTTPClient(cache=FileCache('cache'))

    image_list = download_images(client, TARGET_DATA,
                                 output_dir)
    image_list = resample_images(image_list, output_dir)

    # cv = {'type': 'kfolds', 'n_folds': 10}
    cv = {'type': 'loso'}

    result = analysis.train_model(image_list, algorithm, cv, output_dir)
    filename = '%s_weightmap.nii.gz' % algorithm

    assert result['weightmap'] == filename

    sample_img = nib.load(os.path.join(os.path.dirname(__file__), filename))
    result_img = nib.load(os.path.join(output_dir, filename))

    compare_image_files(sample_img, result_img)


def test_model_test(tmpdir):
    client = HTTPClient(cache=FileCache('cache'))

    output_dir = str(tmpdir)
    weight_map_filename = os.path.join(os.path.dirname(__file__),
                                       'ridge_weightmap.nii.gz')

    image_list = download_images(client, TARGET_DATA,
                                 output_dir)

    # XXX: Better to check for weightmap shape and image shape
    # and adjust weightmap if needed
    image_list = resample_images(image_list, output_dir)

    analysis.apply_mask(image_list, weight_map_filename, output_dir)
