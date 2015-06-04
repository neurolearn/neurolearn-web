import os
import nibabel as nib

from nlweb import analysis

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
