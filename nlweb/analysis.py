import os
import time
import nibabel as nb
import numpy as np
import nltools
import requests
from nltools.analysis import Predict

from .httpclient import HTTPClient, FileCache

BASE_NV_URL = 'http://neurovault.org'



def download(collection_id, outfolder):
    from pyneurovault import api

    # Will extract all collections and images in one query to work from
    nv = api.NeuroVault()

    # Download all images to file
    # standard = os.path.join(
    #     os.path.dirname(api.__file__), 'data', 'MNI152_T1_2mm_brain_mask_dil.nii.gz')

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


def get_collection_images(collection_id):
    url = "%s/api/collections/%s/images/"

    r = requests.get(url % (BASE_NV_URL, collection_id))

    return r.json()


def image_id(url):
    return int(url.split("/")[-2])


def download_images(client, image_list, output_dir):
    dirname = os.path.join(output_dir, 'original')
    try:
        os.makedirs(dirname)
    except (IOError, OSError):
        pass

    image_file_list = []

    for image in image_list:
        filename = os.path.join(dirname, str(image_id(image['url'])))
        print "Retrieving ", image['file']
        image_file_list.append(
            client.retrieve(image['file'], filename, force_cache=True))


def run_ml_analysis2(data, collection_id, algorithm, output_dir):
    tic = time.time()  # Start Timer

    client = HTTPClient(cache=FileCache('cache'))

    image_list = get_collection_images(collection_id)
    download_images(client, image_list['results'], output_dir)
    resample_images()

    print 'Elapsed: %.2f seconds' % (time.time() - tic)  # Stop timer
    tic = time.time()  # Start Timer


def run_ml_analysis(data, collection_id, algorithm, outfolder):
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

    negvneu = Predict(dat, Y, algorithm=algorithm,
                      subject_id=holdout,
                      output_dir=outfolder,
                      cv_dict={'kfolds': kfolds},
                      **extra)

    negvneu.predict()

    print 'Elapsed: %.2f seconds' % (time.time() - tic)  # Stop timer


