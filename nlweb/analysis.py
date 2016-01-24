import time
import logging

import numpy as np
import nibabel as nb
from nltools import analysis


SUMMARY_PROPS = ('mcr_all', 'mcr_xval', 'rmse_all', 'r_all', 'rmse_xval',
                 'r_xval')

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


def to_filename_dict(rows):
    di = {}
    for r in rows:
        di[r['filename']] = r
    return di


def get_summary(predict):
    return {k: getattr(predict, k, None)
            for k in SUMMARY_PROPS if getattr(predict, k, None)}


def train_model(image_list, algorithm, cv, output_dir):
    """
    :param image_list: A list of dictionaries of the form
        {
            'collection_id': '504',
            'filename': 'Pain_Subject_1_Low.nii.gz',
            'target': '1',
            'resampled_file': 'path/to/the/resampled/file.nii.gz',
            'original_file': 'path/to/the/original/file.nii.gz'
        }
    """
    log.info("Concatenating Images...")
    tic = time.time()  # Start Timer

    dat = nb.funcs.concat_images([item['resampled_file']
                                  for item in image_list])

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer
    tic = time.time()  # Start Timer

    Y = np.array([int(item['target']) for item in image_list])

    try:
        holdout = [int(item['subject_id']) for item in image_list]
    except KeyError:
        holdout = None

    if holdout:
        cv['subject_id'] = holdout
    elif cv['type'] == 'loso':
        raise ValueError("subject_id is required for a LOSO cross validation.")

    extra = {}
    if algorithm in ('svr', 'svm'):
        extra = {'kernel': 'linear'}

    predict = analysis.Predict(dat, Y, algorithm=algorithm,
                               output_dir=output_dir,
                               cv_dict=cv,
                               **extra)

    predict.predict()

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer
    return {'weightmap': '%s_weightmap.nii.gz' % algorithm,
            'scatterplot': '%s_scatterplot.png ' % algorithm,
            'stats': predict.stats_output.to_dict('list'),
            'summary': get_summary(predict)}


def set_pattern_expression(pexpc, image_list):
    result = []
    for index, row in pexpc.iterrows():
        image = image_list[index]
        result.append({'r': row[0],
                       'id': image['id'],
                       'thumbnail': image['thumbnail'],
                       'collection_id': image['collection_id'],
                       'filename': image['filename'],
                       'name': image['name']})
    return result


def apply_mask(image_list, weight_map_filename):
    tic = time.time()  # Start Timer

    dat = nb.funcs.concat_images([item['resampled_file']
                                  for item in image_list])

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer
    tic = time.time()  # Start Timer

    weight_map = nb.load(weight_map_filename)

    pexpc = analysis.apply_mask(data=dat, weight_map=weight_map,
                                method='correlation')

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer

    return {
        'correlation': set_pattern_expression(pexpc, image_list)
    }
