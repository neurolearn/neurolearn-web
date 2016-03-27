import os
import time
import logging

import pandas as pd
import numpy as np
import nibabel as nb
from nltools.data import Brain_Data

SUMMARY_PROPS = ('mcr_all', 'mcr_xval', 'rmse_all', 'r_all', 'rmse_xval',
                 'r_xval')

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


def to_filename_dict(rows):
    di = {}
    for r in rows:
        di[r['filename']] = r
    return di


def valid_value(val):
    return val and not np.isnan(val)


def get_summary(output):
    return {k: output[k]
            for k in SUMMARY_PROPS if valid_value(output.get(k, None))}


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

    Y = pd.DataFrame([int(item['target']) for item in image_list])

    try:
        holdout = [int(item['subject_id']) for item in image_list]
    except KeyError:
        holdout = None

    if cv:
        if holdout:
            cv['subject_id'] = holdout
        elif cv['type'] == 'loso':
            raise ValueError(
                "subject_id is required for a LOSO cross validation.")

        cv['n'] = len(image_list)

    extra = {}
    if algorithm in ('svr', 'svm'):
        extra = {'kernel': 'linear'}

    dat = Brain_Data(data=dat, Y=Y)

    output = dat.predict(algorithm=algorithm, cv_dict=cv, plot=True, **extra)

    weightmap_filename = '%s_weightmap.nii.gz' % algorithm
    output['weight_map'].write(os.path.join(output_dir, weightmap_filename))

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer

    result = {'weightmap': weightmap_filename,
              'intercept': float(output['intercept']),
              'scatterplot': '%s_scatterplot.png ' % algorithm,
              'stats': {key: output[key].tolist()
                        for key in ('Y', 'yfit_xval', 'yfit_all')},
              'summary': get_summary(output)}

    if 'roc' in output:
        result['roc'] = output['roc']

    return result


def set_pattern_expression(pexpc, image_list):
    result = []
    for index, row in pexpc.iterrows():
        image = image_list[index]
        result.append({'r': row[0],
                       'id': image['id'],
                       'thumbnail': image['thumbnail'],
                       'collection_id': image['collection_id'],
                       'name': image['name']})
    return result


def set_correlation(correlation_array, image_list):
    result = []
    for index, r in enumerate(correlation_array):
        image = image_list[index]
        result.append({'r': r,
                       'id': image['id'],
                       'thumbnail': image['thumbnail'],
                       'collection_id': image['collection_id'],
                       'name': image['name']})
    return result


def apply_mask(image_list, weight_map_filename):
    tic = time.time()  # Start Timer

    dat = nb.funcs.concat_images([item['resampled_file']
                                  for item in image_list])

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer
    tic = time.time()  # Start Timer

    weight_map = nb.load(weight_map_filename)

    dat = Brain_Data(data=dat)
    r = dat.similarity(weight_map)

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer

    return {
        'correlation': set_correlation(r, image_list)
    }
