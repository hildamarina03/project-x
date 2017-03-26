'use strict';

const MongoDBService = require('./MongoDBService');

class StatusService {
  check() {
    const promise = new Promise((resolve, reject) => {
      MongoDBService.addCollectionUser().then(result => {
        resolve(result);
      },error => {
        reject(error);
      });
    });
    return promise;
  }
}

module.exports = new StatusService();
