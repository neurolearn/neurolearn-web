import os
import time
import logging

import numpy as np
import nibabel as nb
from nltools import analysis
import matplotlib.pyplot as plt


logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


def to_filename_dict(rows):
    di = {}
    for r in rows:
        di[r['filename']] = r
    return di


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
            'scatterplot': '%s_scatterplot.png ' % algorithm}


def apply_mask(image_list, weight_map_filename, output_dir):
    tic = time.time()  # Start Timer

    dat = nb.funcs.concat_images([item['resampled_file']
                                  for item in image_list])

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer
    tic = time.time()  # Start Timer

    weight_map = nb.load(weight_map_filename)
    pexpd = analysis.apply_mask(data=dat, weight_map=weight_map,
                                output_dir=output_dir,
                                method='dot_product',
                                save_output=True)

    pexpc = analysis.apply_mask(data=dat, weight_map=weight_map,
                                output_dir=output_dir,
                                method='correlation',
                                save_output=True)

    plt.subplot(2, 1, 1)
    plt.plot(pexpd)
    plt.title('Pattern Expression')
    plt.ylabel('Dot Product')

    plt.subplot(2, 1, 2)
    plt.plot(pexpc)
    plt.xlabel('Subject')
    plt.ylabel('Correlation')

    plot_filename = 'test_pattern_mask_plot.png'
    plt.savefig(os.path.join(output_dir, plot_filename))

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer

    return {
        'plot': plot_filename
    }
