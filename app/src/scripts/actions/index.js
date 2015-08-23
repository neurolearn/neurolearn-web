import request from 'superagent';

import { REQUEST_MODEL_TRAINING,
         RECEIVE_JOB_ID
} from './actionTypes';


function requestModelTraining() {
  return {
    type: REQUEST_MODEL_TRAINING
  };
}

function startModelTraining(targetData, algorithm, token) {
  const payload = {
    'data': targetData,
    'collection_id': 504,
    'algorithm': algorithm
  };

  return request.post('/analysis')
    .type('json')
    .accept('json')
    .set('Authorization', 'Bearer ' + token)
    .send(payload);
}

function receiveJobId(jobid) {
  return {
    type: RECEIVE_JOB_ID,
    jobid
  };
}

export function trainModel(targetData, algorithm, router) {
  return (dispatch, getState) => {
    dispatch(requestModelTraining());

    return startModelTraining(targetData, algorithm, getState().auth.token)
      .end((err, res) => {
        dispatch(receiveJobId(res.body.jobid));
        router.transitionTo('/');
      });
  };
}
