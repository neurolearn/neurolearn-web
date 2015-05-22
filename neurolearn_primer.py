
# This notebook downloads a private collection from neurovault and runs an SVM.

# One of the notebooks basically just queries and downloads data locally.
# The other notebook is a bunch of tests for various functionality
# of the machine learning prediction and applying the weight map.
# The prediction code is a little kludgy.  I was hoping to just
# be able to pass dictionaries into scikit-learn, but each algorithm
# has a slightly different API and it didn't work very well.
# All of the graphs we will eventually convert to D3.

# TODO:
# Task 1.
# You could try working with the new pain dataset on
# neurovault http://neurovault.org/collections/504/
# Since we don't have the meta-data implemented yet, you can parse
# the file name to try and classify high vs low pain.  The best
# cross-validation is leave one subject out and you would need
# to input a vector of unique subject IDs.  K-fold cross-validation
# is much faster though.  I usually use 5-fold.
#
# Task 2.
# In the meantime I'll try to run analysis using a metadata from a file
# Chang_Aggregated_Trial_Data.csv ("Pain" Dataset) and corresponding
# "Single Subject Thermal Pain" collection from NeuroVault.
# The target column for model fitting will be "Rating".
# http://neurovault.org/collections/504/


""" Code to grab a private collection from NeuroVault, and compute
    an SVM discriminating between negative and neutral images
"""

import sys
import errno
import json
import os
import time
import urllib
from urllib2 import Request, urlopen

import numpy as np
import pandas as pd
import requests
from pandas.io.json import json_normalize

import matplotlib.pyplot as plt
import nibabel as nb
import seaborn as sns
from joblib import Memory
from nilearn.image import mean_img, resample_img
from nilearn.input_data import NiftiMasker
from nilearn.masking import _extrapolate_out_mask, compute_background_mask
from nilearn.plotting import plot_roi, plot_stat_map
from nipype.utils.filemanip import split_filename
from scipy import interp
from sklearn.cross_validation import KFold, LeaveOneLabelOut, StratifiedKFold
from sklearn.metrics import auc, roc_curve
from sklearn.svm import SVC


BASE_NV_URL = 'http://neurovault.org'


def mkdir_p(path):
    try:
        os.makedirs(path)
    except OSError as exc:  # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else:
            raise


def get_collection_json(collection_id=None, private_key=None):
    collection_id = collection_id if collection_id else private_key
    url = "%s/api/collections/%s"

    r = requests.get(url % (BASE_NV_URL, collection_id))

    return r.json()


def get_collections_df(key):
    """Downloads metadata about collections/papers stored in NeuroVault and
    return it as a pandas DataFrame"""

    request = Request(
            '%s/api/collections/%s?format=json' % (BASE_NV_URL, key))

    response = urlopen(request)
    elevations = response.read()
    data = json.loads(elevations)
    collections_df = json_normalize(data)
    collections_df.rename(columns={'id': 'collection_id'}, inplace=True)
    collections_df.set_index("collection_id")

    return collections_df


def get_collection_images_df(key):
    url = "%s/api/collections/%s/images/?format=json"

    request = Request(url % (BASE_NV_URL, key))
    response = urlopen(request)
    elevations = response.read()
    data = json.loads(elevations)

    images_df = json_normalize(data['results'])

    collection_data = get_collection_json(private_key=key)

    images_df['collection'] = collection_data['id']
    images_df['image_id'] = images_df['url'].apply(
        lambda x: int(x.split("/")[-2]))
    images_df.rename(columns={'collection': 'collection_id'}, inplace=True)

    return images_df


def get_images_with_collection_df(key):
    """Downloads metadata about images/statistical maps stored in NeuroVault and
    and enriches it with metadata of the corresponding collections. The result
    is returned as a pandas DataFrame"""

    collections_df = get_collections_df(key)
    images_df = get_collection_images_df(key)

    combined_df = pd.merge(images_df, collections_df, how='inner', on='collection_id',
                           suffixes=('_image', '_collection'))
    return combined_df


def download_and_resample(combined_df, dest_dir, target):
    """Downloads all stat maps and resamples them to a common space.
    """

    target_nii = nb.load(target)
    orig_path = os.path.join(dest_dir, "original")
    mkdir_p(orig_path)
    resampled_path = os.path.join(dest_dir, "resampled")
    mkdir_p(resampled_path)
    out_df = combined_df.copy()

    for row in combined_df.iterrows():
        # Downloading the file to the "original" subfolder
        _, _, ext = split_filename(row[1]['file'])
        orig_file = os.path.join(
            orig_path, "%04d%s" % (row[1]['image_id'], ext))
        if not os.path.exists(orig_file):
            print "Downloading %s" % orig_file
            urllib.urlretrieve(row[1]['file'], orig_file)

        # Compute the background and extrapolate outside of the mask
        print "Extrapolating %s" % orig_file
        niimg = nb.load(orig_file)
        data = niimg.get_data().squeeze()
        niimg = nb.Nifti1Image(data, niimg.affine,
                               header=niimg.get_header())
        bg_mask = compute_background_mask(niimg).get_data()
        # Test if the image has been masked:
        out_of_mask = data[np.logical_not(bg_mask)]
        if np.all(np.isnan(out_of_mask)) or len(np.unique(out_of_mask)) == 1:
            # Need to extrapolate
            data = _extrapolate_out_mask(data.astype(np.float), bg_mask,
                                         iterations=3)[0]
        niimg = nb.Nifti1Image(data, niimg.affine,
                               header=niimg.get_header())
        del out_of_mask, bg_mask
        # Resampling the file to target and saving the output in the "resampled"
        # folder
        resampled_file = os.path.join(resampled_path,
                                      "%06d%s" % (row[1]['image_id'], ext))

        print "Resampling %s" % orig_file
        resampled_nii = resample_img(niimg, target_nii.get_affine(),
                                     target_nii.shape)
        resampled_nii = nb.Nifti1Image(resampled_nii.get_data().squeeze(),
                                       resampled_nii.get_affine(),
                                       header=niimg.get_header())
        if len(resampled_nii.shape) == 3:
            resampled_nii.to_filename(resampled_file)
        else:
            # We have a 4D file
            assert len(resampled_nii.shape) == 4
            resampled_data = resampled_nii.get_data()
            affine = resampled_nii.affine
            for index in range(resampled_nii.shape[-1]):
                # First save the files separately
                this_nii = nb.Nifti1Image(resampled_data[..., index],
                                          affine)
                this_id = int("%i%i" % (-row[1]['image_id'], index))
                this_file = os.path.join(resampled_path,
                                         "%06d%s" % (this_id, ext))
                this_nii.to_filename(this_file)

                # Second, fix the dataframe
                out_df = out_df[out_df.image_id != row[1]['image_id']]
                this_row = row[1].copy()
                this_row.image_id = this_id
                out_df = out_df.append(this_row)

    return out_df


def roc_plot(tpr, fpr):
    mean_auc = auc(fpr, tpr)
    fig = plt.plot(
        fpr, tpr, 'r-', label='Mean ROC (area = %0.2f)' % mean_auc, lw=4)
    plt.xlim([-0.05, 1.05])
    plt.ylim([-0.05, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver operating characteristic ')
    return fig


def dist_from_hyperplane_plot(stats_output):
    fig = sns.factorplot(
        "SubID", "xval_dist_from_hyperplane", hue="Y",
        data=stats_output, kind='point')
    plt.xlabel('Subject')
    plt.ylabel('Distance from Hyperplane')
    plt.title('SVM Classification')
    return fig


def run_ml_analysis(basedir, dest_dir):
    """Run Machine Learning Analysis"""
    tic = time.time()  # Start Timer

    # Separate image types and sort
    combined_df = pd.read_csv('%s/metadata.csv' % dest_dir, encoding='utf8')
    neg_list = combined_df.ix[
        combined_df.name_image.str.contains('Neg'), ].sort(columns='name_image')
    neu_list = combined_df.ix[
        combined_df.name_image.str.contains('Neu'), ].sort(columns='name_image')

    # Load data using nibabel
    neg_file_list = [dest_dir + '/resampled/00' +
                     str(x) + '.nii.gz' for x in neg_list.image_id]
    neu_file_list = [dest_dir + '/resampled/00' +
                     str(x) + '.nii.gz' for x in neu_list.image_id]
    dat = nb.funcs.concat_images(neg_file_list + neu_file_list)

    # Mask data
    mask_img = nb.load(
        os.path.join(basedir, 'resources/MNI152_T1_2mm_brain_mask_dil.nii.gz'))
    mn_img = mean_img(dat)
    nifti_masker = NiftiMasker(mask_img=mask_img)
    dat_masked = nifti_masker.fit_transform(dat)

    # Classification
    nSub = 20
    Y = np.array([1] * nSub + [0] * nSub)
    svc = SVC(kernel='linear')
    svc.fit(dat_masked, Y)

    # Save Weights: Write out weight map to nifti image
    coef_ = svc.coef_
    intercept_ = svc.intercept_
    coef_img = nifti_masker.inverse_transform(coef_)
    nb.save(coef_img, dest_dir + '/Neg_vs_Neu_SVM_weights.nii')

    # Cross-validation
    cv = StratifiedKFold(Y, n_folds=5)
    cv_scores = []
    mean_tpr = 0.0
    all_tpr = []
    mean_fpr = np.linspace(0, 1, 100)
    yfit = np.array([0] * nSub * 2)
    xval_dist_from_hyperplane = np.array([0] * nSub * 2)

    for train, test in cv:
        svc.fit(dat_masked[train], Y[train])
        yfit[test] = svc.predict(dat_masked[test])
        xval_dist_from_hyperplane[
            test] = svc.decision_function(dat_masked[test])

        # Compute ROC curve and area the curve
        fpr, tpr, thresholds = roc_curve(Y[test], yfit[test])
        mean_tpr += interp(mean_fpr, fpr, tpr)

    mean_tpr /= len(cv)
    mean_tpr[0] = 0.0
    mean_tpr[-1] = 1.0

    # Save Stats Output
    stats_out = pd.DataFrame({
        'SubID': range(0, nSub) * 2,
        'xval_dist_from_hyperplane': xval_dist_from_hyperplane,
        'Y': Y,
        'yfit': yfit})
    stats_out.to_csv(dest_dir + 'SVM_Stats_Output.csv')

    # Display results
    print 'overall CV accuracy: %.2f' % np.mean(yfit == Y)
    print 'AUC: %.2f' % auc(mean_fpr, mean_tpr)
    print 'Forced Choice Accuracy: %.2f' % np.mean((xval_dist_from_hyperplane[0:nSub] - xval_dist_from_hyperplane[nSub:]) > 0)

    # Plots
    fig3 = roc_plot(mean_tpr, mean_fpr)
    plt.savefig(dest_dir + '/Neg_vs_Neu_SVM_ROC_plot.png')

    fig1 = plot_roi(nifti_masker.mask_img_, mn_img, title="Mask",
                    cut_coords=range(-40, 40, 10), display_mode='z')
    fig1.savefig(dest_dir + '/Neg_vs_Neu_SVM_mask.png')

    fig2 = plot_stat_map(coef_img, mn_img, title="SVM weights",
                         cut_coords=range(-40, 40, 10), display_mode='z')

    fig2.savefig(dest_dir + '/Neg_vs_Neu_SVM_weightmap.png')

    fig4 = dist_from_hyperplane_plot(stats_out)
    fig4.savefig(
        dest_dir + '/Neg_vs_Neu_SVM_xVal_Distance_from_Hyperplane.png')

    print 'Elapsed: %.2f seconds' % (time.time() - tic)


def run_ml_analysis_nltools(basedir, dest_dir):
    """
    From:
      https://github.com/ljchang/neurolearn/blob/master/scripts%2FTest_Predict.ipynb
    """
    sys.path.append('../neurolearn')

    from nltools.analysis import Predict

    tic = time.time()  # Start Timer

    # Read images metadata
    combined_df = pd.read_csv('%s/metadata.csv' % dest_dir, encoding='utf8')
    # neg_list = combined_df.ix[
    #     combined_df.name_image.str.contains('Neg'), ].sort(columns='name_image')
    # neu_list = combined_df.ix[
    #     combined_df.name_image.str.contains('Neu'), ].sort(columns='name_image')

    # Load data using nibabel
    # neg_file_list = [
    #     dest_dir + '/resampled/00' + str(x) + '.nii.gz' for x in neg_list.image_id]
    # neu_file_list = [
    #     dest_dir + '/resampled/00' + str(x) + '.nii.gz' for x in neu_list.image_id]

    file_list = [
        dest_dir + '/resampled/00' + str(x) + '.nii.gz' for x in combined_df.image_id]

    # dat = nb.funcs.concat_images(neg_file_list + neu_file_list)
    # get concat w/o splitting like this:
    dat = nb.funcs.concat_images(file_list)

    # def to_int(s):
    #     return s.find('Neg') + 1
    def to_int(s):
        if s.find('Low') > -1:
            return 0
        if s.find('Medium') > -1:
            return 1
        if s.find('High') > -1:
            return 2

    Y = np.array([to_int(s) for s in combined_df.name_image])

    sublist = np.array([x[:-7].split('/')[-1] for x in file_list])
    sublist = range(0, len(file_list))

    # # Test SVM with kfold xVal
    # negvneu = Predict(dat, Y, algorithm='svm', subject_id=sublist,
    #                   output_dir=dest_dir, cv_dict={'kfolds': 5}, **{'kernel': "linear"})

    negvneu = Predict(dat, Y, algorithm='ridge', subject_id=sublist,
                      output_dir=dest_dir, cv_dict={'kfolds': 5})

    negvneu.predict()

    print 'Elapsed: %.2f seconds' % (time.time() - tic)  # Stop timer


def get_weight_map():
    ### Download Weight Map ###
    # Get Meta-Data associated with private key
    k = 'TMTKHDFM'  # Private Key
    coll_pines = get_collections_df(key=k)
    pines_df = get_images_with_collection_df(k)

    # Download and resample
    dest_dir = "/Users/lukechang/Dropbox/NEPA/Test_Analysis"
    target = os.path.join(basedir, "resources/MNI152_T1_2mm.nii.gz")
    pines_df = mem.cache(download_and_resample)(pines_df, dest_dir, target)
    pines_df.to_csv('%s/pines_metadata.csv' % dest_dir, encoding='utf8')


def test_patter_expression():

    tic = time.time()  # Start Timer

    # Load data using nibabel
    dat = nb.funcs.concat_images(neg_file_list + neu_file_list)
    pines = nb.load(os.path.abspath(
        dest_dir + '/resampled/00' + str(combined_df.image_id[0]) + '.nii.gz'))

    # Mask data
    nifti_masker = NiftiMasker(mask_img=mask_img)
    dat_masked = nifti_masker.fit_transform(dat)
    pines_masked = nifti_masker.fit_transform(pines)

    # Calculate pattern expression
    pexp = np.dot(dat_masked, np.transpose(pines_masked)) + intercept_

    # Calculate ROC plot
    mean_fpr = np.linspace(0, 1, 100)
    fpr, tpr, thresholds = roc_curve(Y, pexp)
    stats_out.xval_dist_from_hyperplane = pexp

    # Display results
    print 'overall CV accuracy: %.2f' % np.mean(pexp + 1.1236 > 0)
    print 'AUC: %.2f' % auc(fpr, tpr)
    print 'Forced Choice Accuracy: %.2f' % np.mean((pexp[0:nSub] - pexp[nSub:]) > 0)

    fig1 = roc_plot(tpr, fpr)
    plt.savefig(dest_dir + '/PINES_PExp_Neg_vs_Neu_SVM_ROC_plot.png')

    fig2 = dist_from_hyperplane_plot(stats_out)
    fig2.savefig(
        dest_dir + '/PINES_PExp_Neg_vs_Neu_SVM_xVal_Distance_from_Hyperplane.png')

    print 'Elapsed: %.2f seconds' % (time.time() - tic)  # Stop timer


def extra_code():
    from nltools.analysis import Predict

    tic = time.time()  # Start Timer

    # Separate image types and sort
    combined_df = pd.read_csv('%s/metadata.csv' % dest_dir, encoding='utf8')
    neg_list = combined_df.ix[
        combined_df.name_image.str.contains('Neg'), ].sort(columns='name_image')
    neu_list = combined_df.ix[
        combined_df.name_image.str.contains('Neu'), ].sort(columns='name_image')

    # Load data using nibabel
    neg_file_list = [dest_dir + '/resampled/00' +
                     str(x) + '.nii.gz' for x in neg_list.image_id]
    neu_file_list = [dest_dir + '/resampled/00' +
                     str(x) + '.nii.gz' for x in neu_list.image_id]
    dat = nb.funcs.concat_images(neg_file_list + neu_file_list)
    Y = np.array([1] * len(neg_file_list) + [0] * len(neu_file_list))

    # negvneu = Predict(dat,Y,algorithm='svm',output_dir=dest_dir, kernel="linear")
    # negvneu = Predict(dat,Y,algorithm='linear',output_dir=dest_dir)
    negvneu = Predict(dat, Y, algorithm='svm', output_dir=dest_dir)
    negvneu.predict()

    # > Here I got "ValueError: coef_ is only available when using a linear kernel"

    print 'Elapsed: %.2f seconds' % (time.time() - tic)  # Stop timer


def main(collection_key):
    # Use a joblib memory, to avoid depending on an Internet connection

    # Set Paths
    dest_dir = "/Users/burnash/projects/neuro/neurolearn/Test_Analysis/%s" % k
    basedir = os.path.abspath(
        '/Users/burnash/projects/neuro/neurolearn/nltools/')
    canonical = os.path.join(basedir, "resources/MNI152_T1_2mm.nii.gz")

    mem = Memory(cachedir='/tmp/neurovault_analysis/cache')

    combined_df = get_images_with_collection_df(collection_key)

    # Download and resample
    combined_df = mem.cache(download_and_resample)(
        combined_df, dest_dir, canonical)

    combined_df.to_csv('%s/metadata.csv' % dest_dir, encoding='utf8')

    # run_ml_analysis(basedir, dest_dir)
    run_ml_analysis_nltools(basedir, dest_dir)

    # Get Weight Map
    # get_weight_map()

    # Test Pattern Expression
    # test_patter_expression()

    # Extra Code
    # extra_code()

if __name__ == '__main__':
    # k = 'NNGSIZTQ'  # Private Key
    k = 504

    main(k)
