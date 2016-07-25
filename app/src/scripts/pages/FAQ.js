/* @flow */

import React from 'react';
import {Link} from 'react-router';

import Footer from '../components/Footer';

const FAQ = () => (
  <div style={{paddingBottom: 50}}>
    <h1 className="page-header">Frequently Asked Questions</h1>
    <div className="row" style={{paddingBottom: 50}}>
      <div className="col-md-8">
        <ul>
          <li><a href="#q1">What is Neuro-learn.org?</a></li>
          <li><a href="#q2">How do I get an account?</a></li>
          <li><a href="#q3">How long will my data be stored?</a></li>
          <li><a href="#q4">Are my analyses private?</a></li>
          <li><a href="#q5">How do I train a model?</a></li>
          <li><a href="#q6">How do I test a model?</a></li>
          <li><a href="#q7">How do I upload my own data?</a></li>
          <li><a href="#q8">What do I do if I discover a bug?</a></li>
          <li><a href="#q9">How can I contribute to the development of neuro-learn?</a></li>
        </ul>
        <a name="q1"></a>
        <h2>What is Neuro-learn.org?</h2>
        <p>Neurolearn is a web platform for analyzing neuroimaging data stored in <a href="http://neurovault.org">NeuroVault</a> using machine-learning tools.  The basic concept is to provide an easy to use interface to allow researchers to develop predictive brain models of psychological states by applying multivariate decoding methods to open source data publicly shared via neurovault.  These predictive brain models can be shared with other researchers and also tested on any data available on neurovault.  This can be useful for assessing the sensitivity and specificity of the brain pattern to other psychological states.</p>
        <p>Ultimately, we hope that this tool will contribute to accelerating the development and validation cycle of brain-based markers of psychological states and will aid in promoting a more open and transparent study of the human mind.</p>
        <p>Neurolearn was created by Luke Chang and Tor Wager and developed by Anton Burnashev.  It is supported by grants from the National Institute of Health (R01DA035484-02S1).</p>

        <a name="q2"></a>
        <h2>How do I get an account?</h2>
        <p>Users can anonymously browse models and tests that have been publicly shared by clicking on the Explore tab.  You must have a user account to train and test your own models.  Accounts are created and managed by neurovault.org.  You must authorize neurolearn to access your neurovault account information.  This authorization can be revoked at any time by removing neurolearn from the neurovault account settings page.</p>

        <a name="q3"></a>
        <h2>How long will my data be stored?</h2>
        <p>Your data will be stored indefinitely as long as neurolearn continues to exist.  You can always download any model you have trained or your test results.  You can also optionally choose to upload any of your models to the neurovault data repository.</p>

        <a name="q4"></a>
        <h2>Are my analyses private?</h2>
        <p>All of your analyses will be made publicly available by default, but you will have the option of making any of these private in your dashboard.</p>

        <a name="q5"></a>
        <h2>How do I train a model?</h2>
        <p>To train a model you first need to be logged in to your neurovault account.</p>

        <ol>
          <li><strong>Train New Model.</strong> Begin by clicking on the ‘+ New Model’ under the Models tab of your dashboard.  You will then be directed to the input data screen.</li>
          <li><strong>Input Data</strong> You can select images from any collection publicly available on neurovault or in which you have access via a private key.  Collections can be filtered by keywords or properties of the collection.  Select specific images that you would like to use from each collection and add it to your ‘selected images’ tab.</li>
          <li><strong>Training Label.</strong>  Once you have selected the images you would like to use for training, you need to specify the training labels for your model.  This refers to the values that you would like to predict or classify from the multivariate brain model.
            <ul>
              <li>Right click on any column you would like to use or create a new column and manually enter values.</li>
              <li>You must specify which column you would like to use as the training labels.  Training labels can be continuous or they can refer to two discrete categories. When performing classification the labels must be either ‘1’ for the target class and ‘0’ for the alternative class.</li>
              <li>You can optionally specify a column with subject labels if you would like to have a set of images held out together during cross-validation.  This can be useful when you are training a model using multiple images from the same subjects.  This ensures that the same subjects will be held out during cross-validation and will help minimize potential overfitting.</li>
              <li>When you are finished, click the button to continue to model preferences.</li>
            </ul>
          </li>
          <li><strong>Model Preferences.</strong>  In this screen you will provide basic details about the type of methods you would like to use to train your model.
            <ul>
              <li>First, start by inputting a sensible name for your model.</li>
              <li>Then select the type of algorithm you would like to use to train your model.</li>
              <li>You need to decide if you are performing ‘prediction’ or ‘classification’.  We currently only have linear methods implemented.</li>
              <li>Next, you need to decide on the type of cross-validation you would like to use. ‘k-fold’ requires you to specify the number of folds to use.</li>
              <li>If you selected an optional subject label, data from the same subject will be automatically held out together in the same cross-validation fold.  ‘Leave One Subject Out’ will train a model on all data except for one subject and then will test on the held out subject.</li>
              <li>Finally, you can choose to not use cross-validation.  This will result in training the model much faster, but you will not have any information about how well the model will generalize beyond the training data.</li>
            </ul>
          </li>
        </ol>

        <a name="q6"></a>
        <h2>How do I test a model?</h2>
        <p>To test a model you first need to be logged in to your neurovault account.</p>
        <ol>
          <li><strong>Select Model.</strong>  First, you need to select the model you would like to use to use for testing.  This can be done using models you have trained on your dashboard, or using models trained by others on the explore tab.</li>
          <li><strong>Input Data.</strong>  Next, you need to select images from collections to evaluate your model.  You can select images from any collection publicly available on neurovault or in which you have access via a private key.  Collections can be filtered by keywords or properties of the collection.  Select specific images that you would like to use from each collection and add it to your ‘selected images’ tab.</li>
          <li><strong>Aggregate Images.</strong>  Similarity between the model and each selected image will be calculated using pearson spatial correlations.  These correlations can be aggregated across images by adding them to a new grouping variable.</li>
        </ol>

        <a name="q7"></a>
        <h2>How do I upload my own data?</h2>
        <p>Data must be uploaded directly to neurovault.  There are two ways to upload your data.</p>
        <ul>
          <li>The primary upload method is to use the neurovault graphic interface and follow all of the instructions.</li>
          <li>Alternatively, there is a programmatic method to upload data using the neurovault upload API.  Make sure that you upload any meta-data associated with the images using the ‘edit image metadata’ button.  This will allow you to manually upload a csv file or create columns using an interactive table interface.</li>
        </ul>

        <a name="q8"></a>
        <h2>What do I do if I discover a bug?</h2>
        <p>Please send an email to <a href="mailto:neurolearnweb@gmail.com">neurolearnweb@gmail.com</a> with details about the circumstances under which the bug occurred  or start a new issue on our github sites.</p>

        <a name="q9"></a>
        <h2>How can I contribute to the development of neuro-learn?</h2>
        <p>Please send any feedback and suggestions to <a href="mailto:neurolearnweb@gmail.com">neurolearnweb@gmail.com</a>, or start an issue on our github sites.  We encourage interested developers to contribute pull requests to our github repositories.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default FAQ;
