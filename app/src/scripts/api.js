import request from 'superagent';

const api = {
  fetchAuthToken: (email, password) => {
    return request.post('/auth')
      .type('json')
      .accept('json')
      .send({email, password});
  },

  fetchMLModels: (token) => {
    return request.get('/mlmodels')
      .type('json')
      .accept('json')
      .set('Authorization', 'Bearer ' + token);
  },

  deleteMLModel: (modelId, token) => {
    return request.del(`/mlmodels/${modelId}`)
      .set('Authorization', 'Bearer ' + token);
  },

  fetchModelTests: (token) => {
    return request.get('/tests')
      .type('json')
      .accept('json')
      .set('Authorization', 'Bearer ' + token);
  },

  deleteModelTest: (modelId, token) => {
    return request.del(`/tests/${modelId}`)
      .set('Authorization', 'Bearer ' + token);
  },

  saveCorrelationGroups: (modelId, groups, token) => {
    return request.post(`/tests/${modelId}/groups`)
      .set('Authorization', 'Bearer ' + token)
      .send(groups)
      .type('json');
  },

  fetchImagesMetadata: (collectionId) => {
    const url = `/nvproxy/api/collections/${collectionId}/images/`;
    return request.get(url);
  },

  startModelTraining: (name, algorithm, targetData, cv, token) => {
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
  },

  startModelTesting: (modelId, selectedImages, token) => {
    const payload = {
      modelId,
      selectedImages
    };

    return request.post('/tests')
      .type('json')
      .accept('json')
      .set('Authorization', 'Bearer ' + token)
      .send(payload);
  },

  search: (query, filter, aggs, sort, from, size) => {
    return request.post('/search')
      .send({
        query: {
          filtered: {
            query: query,
            filter: filter
          }
        },
        aggs: aggs,
        sort: sort,
        from: from,
        size: size
      })
      .type('json')
      .accept('json');
  }
};

export default api;
