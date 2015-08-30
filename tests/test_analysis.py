import os
import nibabel as nib

from nlweb import analysis

from nlweb.httpclient import HTTPClient, FileCache
from nlweb.image_utils import (download_images, resample_images,
                               fetch_collection_images)

from .nv_test_data import DATA, COLLECTION_ID


def compare_image_files(img_a, img_b):
    assert img_a.get_data().shape == img_b.get_data().shape
    assert (img_a.get_data() == img_b.get_data()).all()


def test_analysis(tmpdir):
    algorithm = 'ridge'
    output_dir = str(tmpdir)

    analysis.run_ml_analysis(DATA, COLLECTION_ID, algorithm, output_dir)

    filename = '%s_weightmap.nii.gz' % algorithm
    sample_img = nib.load(os.path.join(os.path.dirname(__file__), filename))
    result_img = nib.load(os.path.join(output_dir, filename))

    compare_image_files(sample_img, result_img)


def test_train_model(tmpdir):
    algorithm = 'ridge'
    output_dir = str(tmpdir)

    # Pull fetch out of train_model
    client = HTTPClient(cache=FileCache('cache'))

    image_list = fetch_collection_images(COLLECTION_ID)
    image_list = download_images(client, image_list['results'],
                                 output_dir)
    image_list = resample_images(image_list, output_dir)

    analysis.train_model(DATA, image_list, algorithm, output_dir)
    filename = '%s_weightmap.nii.gz' % algorithm
    sample_img = nib.load(os.path.join(os.path.dirname(__file__), filename))
    result_img = nib.load(os.path.join(output_dir, filename))

    compare_image_files(sample_img, result_img)
