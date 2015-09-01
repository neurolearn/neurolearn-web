import request from 'superagent';

import { REQUEST_MODEL_TRAINING,
         RECEIVE_JOB_ID
} from './actionTypes';


function requestModelTraining() {
  return {
    type: REQUEST_MODEL_TRAINING
  };
}

function startModelTraining(name, algorithm, targetData, cv, token) {
  const payload = {
    'data': targetData,
    'collection_id': 504,
    algorithm,
    name,
    cv
  };

  return request.post('/mlmodels')
    .type('json')
    .accept('json')
    .set('Authorization', 'Bearer ' + token)
    .send(payload);
}

function receiveJobId() {
  return {
    type: RECEIVE_JOB_ID
  };
}

export function trainModel(name, algorithm, targetData, crossValidation, router) {
  return (dispatch, getState) => {
    dispatch(requestModelTraining());

    return startModelTraining(name, algorithm, targetData, crossValidation,
                              getState().auth.token)
      .end((err, res) => {
        dispatch(receiveJobId());
        router.transitionTo('/');
      });
  };
}
