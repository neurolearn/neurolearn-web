import request from 'superagent';

const api = {
  fetchAuthToken: (email, password, callback) => {
    return request.post('/auth')
      .type('json')
      .accept('json')
      .send({email, password})
      .end(callback);
  },

  fetchAuthUserMLModels: (token, callback) => {
    return request.get('/user/mlmodels')
      .type('json')
      .accept('json')
      .set('Authorization', 'Bearer ' + token)
      .end(callback);
  },

  fetchMLModels: (callback) => {
    return request.get('/mlmodels')
      .type('json')
      .accept('json')
      .end(callback);
  },

  fetchModelTests: (callback) => {
    return request.get('/tests')
      .type('json')
      .accept('json')
      .end(callback);
  },

  fetchMLModel: (modelId, token, callback) => {
    let req = request.get(`/mlmodels/${modelId}`)
      .type('json')
      .accept('json');

    if (token) {
      req = req.set('Authorization', 'Bearer ' + token);
    }

    return req.end(callback);
  },

  deleteMLModel: (modelId, token, callback) => {
    return request.del(`/mlmodels/${modelId}`)
      .set('Authorization', 'Bearer ' + token)
      .end(callback);
  },

  fetchAuthUserModelTests: (token, callback) => {
    return request.get('/user/tests')
      .type('json')
      .accept('json')
      .set('Authorization', 'Bearer ' + token)
      .end(callback);
  },

  deleteModelTest: (modelId, token, callback) => {
    return request.del(`/tests/${modelId}`)
      .set('Authorization', 'Bearer ' + token)
      .end(callback);
  },

  saveCorrelationGroups: (modelId, groups, token, callback) => {
    return request.post(`/tests/${modelId}/groups`)
      .set('Authorization', 'Bearer ' + token)
      .send(groups)
      .type('json')
      .end(callback);
  },

  fetchImagesMetadata: (collectionId, callback) => {
    const url = `/nvproxy/api/collections/${collectionId}/images/`;
    return request.get(url).end(callback);
  },

  trainModel: (name, algorithm, targetData, cv, token, callback) => {
    const payload = {
      'data': targetData.data,
      'trainingLabel': targetData.trainingLabel,
      algorithm,
      name,
      cv
    };

    return request.post('/mlmodels')
      .type('json')
      .accept('json')
      .set('Authorization', 'Bearer ' + token)
      .send(payload)
      .end(callback);
  },

  testModel: (modelId, selectedImages, token, callback) => {
    const payload = {
      modelId,
      selectedImages
    };

    return request.post('/tests')
      .type('json')
      .accept('json')
      .set('Authorization', 'Bearer ' + token)
      .send(payload)
      .end(callback);
  },

  search: (params, callback) => {
    return request.post('/search')
      .send(params)
      .type('json')
      .accept('json')
      .end(callback);
  }
};

export default api;
