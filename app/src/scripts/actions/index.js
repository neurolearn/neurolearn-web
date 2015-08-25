import request from 'superagent';

import { REQUEST_MODEL_TRAINING,
         RECEIVE_JOB_ID
} from './actionTypes';


function requestModelTraining() {
  return {
    type: REQUEST_MODEL_TRAINING
  };
}

function startModelTraining(targetData, algorithm, name, token) {
  const payload = {
    'data': targetData,
    'collection_id': 504,
    algorithm,
    name
  };

  return request.post('/analysis')
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

export function trainModel(targetData, algorithm, name, router) {
  return (dispatch, getState) => {
    dispatch(requestModelTraining());

    return startModelTraining(targetData, algorithm, name, getState().auth.token)
      .end((err, res) => {
        dispatch(receiveJobId());
        router.transitionTo('/');
      });
  };
}
