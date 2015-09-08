import os
import time
import logging

import numpy as np
import nibabel as nb
import nltools
from nltools import analysis
import matplotlib.pyplot as plt


logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)


def download(collection_id, outfolder):
    from pyneurovault import api

    # Will extract all collections and images in one query to work from
    nv = api.NeuroVault()

    # Download all images to file
    # standard = os.path.join(
    # os.path.dirname(api.__file__), 'data',
    # 'MNI152_T1_2mm_brain_mask_dil.nii.gz')

    standard = os.path.join(
        os.path.dirname(nltools.__file__), 'resources', 'MNI152_T1_2mm_brain_mask_dil.nii.gz')

    nv.download_images(dest_dir=outfolder, target=standard,
                       collection_ids=[collection_id], resample=True)

    # Create Variables
    collection_data = nv.get_images_df(
    ).ix[nv.get_images_df().collection_id == collection_id, :].reset_index()

    return collection_data


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

    holdout = range(len(image_list))

    Y = np.array([int(item['target']) for item in image_list])

    extra = {}
    if algorithm in ('svr', 'svm'):
        extra = {'kernel': 'linear'}

    cv_dict = {cv['type']: cv['value']}

    if cv['type'] == 'kfold':
        cv_dict['kfold'] = 5 if len(Y) > 5 else len(Y)

    negvneu = analysis.Predict(dat, Y, algorithm=algorithm,
                               subject_id=holdout,
                               output_dir=output_dir,
                               cv_dict=cv_dict,
                               **extra)

    negvneu.predict()

    log.info("Elapsed: %.2f seconds", (time.time() - tic))  # Stop timer
    return {'weightmap': '%s_weightmap.nii.gz' % algorithm,
            'scatterplot': '%s_scatterplot.png ' % algorithm}


def run_ml_analysis(data, collection_id, algorithm, outfolder):
    """
    Original function translated from iPython Notebook
    """
    print data

    tic = time.time()  # Start Timer

    collection_data = download(collection_id, outfolder)

    print 'Elapsed: %.2f seconds' % (time.time() - tic)  # Stop timer
    tic = time.time()  # Start Timer

    img_index = sorted((e, i) for i, e in enumerate(collection_data.file))

    index = [x[1] for x in img_index]
    img_file = [x[0] for x in img_index]

    dat = nb.funcs.concat_images([os.path.join(outfolder, 'resampled', '00' + str(
        x) + '.nii.gz') for x in collection_data.image_id[index]])

    # holdout = [int(x.split('_')[-2]) for x in img_file]
    # XXX: use index as subject_id for a while:
    holdout = index

    # heat_level = [x.split('_')[-1].split('.')[0] for x in img_file]

    filename_dict = to_filename_dict(data)

    Y_list = []
    for x in img_file:
        basename = os.path.basename(x)
        Y_list.append(int(filename_dict[basename]['target']))

    # Y_dict = {'High': 3, 'Medium': 2, 'Low': 1}
    # Y = np.array([Y_dict[x] for x in heat_level])
    Y = np.array(Y_list)

    # Test Prediction with kfold xVal
    # SVR
    # negvneu = Predict(dat,Y,algorithm='svr',subject_id = holdout, output_dir=outfolder, cv_dict = {'kfolds':5}, **{'kernel':"linear"})
    # negvneu = Predict(dat,Y,algorithm='svr',subject_id = holdout, output_dir=outfolder, cv_dict = {'loso':holdout}, **{'kernel':"linear"})
    # negvneu.predict()
    # print 'Elapsed: %.2f seconds' % (time.time() - tic) #Stop timer

    kfolds = 5 if 5 < len(Y) else len(Y)

    extra = {}
    if algorithm in ('svr', 'svm'):
        extra = {'kernel': 'linear'}

    negvneu = analysis.Predict(dat, Y, algorithm=algorithm,
                               subject_id=holdout,
                               output_dir=outfolder,
                               cv_dict={'kfolds': kfolds},
                               **extra)

    negvneu.predict()

    print 'Elapsed: %.2f seconds' % (time.time() - tic)  # Stop timer


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
