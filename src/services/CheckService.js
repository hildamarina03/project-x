'use strict';

const logger = require('../logger');

class CheckService {
  checkParams(params) {
    logger.verbose('CheckService - checkParams', arguments);
    const promise = new Promise((resolve, reject) => {
      this.checkString(params.userId).then(() => {
        this.checkString(params.message).then(() => {
          this.checkRecipients(params.recipients).then(() =>{
            resolve();
          }, error => {
            reject(error);
          });
        }, error => {
          reject(error);
        });
      }, error => {
        reject(error);
      });
    });

    return promise;
  }

   checkString(stringParam) {
     logger.verbose('CheckService - checkString', arguments);
     return new Promise((resolve, reject) => {
       if(typeof stringParam !== 'undefined' && typeof stringParam === 'string') {
         resolve();
       } else {
         reject('Invalid string param');
       }
     });
  };

}




module.exports = new CheckService();
