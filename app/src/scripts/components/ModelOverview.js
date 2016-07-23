/* @flow */

import React, { PropTypes } from 'react';

import { algorithmNameMap } from '../constants/Algorithms';
import { pluralize } from '../utils.js';

import styles from './ModelOverview.scss';

type UserType = {
  id: number
};

type ModelType = {
  user: UserType,
  images_count: number,
  label_name: string,
  algorithm: string
};

const ModelOverview = (
  { model, user, onAlgorithmClick }
: { model: ModelType,
    user: UserType,
    onAlgorithmClick: () => void }
) => {
  const userIsOwner = (user && model.user.id === user.id);
  const algorithmName = algorithmNameMap[model.algorithm];

  return (<div className={styles.root}>
      <div className="row">
          <div className="col-md-4 col-xs-12">
              <div className="attribute-label">Algorithm</div>
              <p>{algorithmName} {userIsOwner && <span className="action pull-right" onClick={onAlgorithmClick}><i className="fa fa-pencil"></i> Edit</span>}</p>
          </div>
          <div className="col-md-4 col-xs-12">
              <div className="attribute-label">Training Label</div>
              <p>{model.label_name}</p>
          </div>
          <div className="col-md-4 col-xs-12">
              <div className="attribute-label">Training Dataset</div>
              <p>{model.images_count} {pluralize(model.images_count, 'image', 'images')}</p>
          </div>
      </div>
    </div>
  );
}

ModelOverview.propTypes = {
  model: PropTypes.object.isRequired,
  user: PropTypes.object,
  onAlgorithmClick: PropTypes.func.isRequired
};

export default ModelOverview;
