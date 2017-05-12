'use strict';

const logger = require('../logger');

class CheckService {

  /*
  * TODO check if user really exists
  * */
  checkUser(stringParam, nameParam, isRequired) {
    logger.verbose('CheckService - checkUser', arguments);
    return new Promise((resolve, reject) => {
      if((typeof stringParam !== 'undefined' && typeof stringParam === 'string')  ||
        (!isRequired && typeof stringParam === 'undefined')
      ) {
        resolve();
      } else {
        reject('Invalid param ' + stringParam + ' ' + nameParam);
      }
    });
  };

  /*
   * TODO check if trip really exists
   * */
  checkTrip(stringParam, nameParam, isRequired) {
    logger.verbose('CheckService - checkTrip', arguments);
    return new Promise((resolve, reject) => {
      if((typeof stringParam !== 'undefined' && typeof stringParam === 'string')  ||
        (!isRequired && typeof stringParam === 'undefined')
      ) {
        resolve();
      } else {
        reject('Invalid param ' + stringParam + ' ' + nameParam);
      }
    });
  };

  checkBoolean(stringParam, nameParam, isRequired) {
    logger.verbose('CheckService - checkBoolean', arguments);
    return new Promise((resolve, reject) => {
      if((typeof stringParam !== 'undefined' && typeof stringParam === 'boolean')  ||
        (!isRequired && typeof stringParam === 'undefined')
      ) {
        resolve();
      } else {
        reject('Invalid boolean param ' + stringParam + ' ' + nameParam);
      }
    });
  };

  checkStringArray(stringParam, nameParam, isRequired) {
    logger.verbose('CheckService - checkStringArray', arguments);
    return new Promise((resolve, reject) => {
      if(!isRequired && typeof stringParam === 'undefined'
      ) {
        resolve();
      } else if (typeof stringParam === 'object') {
        let errorFound = false;
        for (let i = 0; i < stringParam.length; i++) {
          if(typeof stringParam[i] !== 'string') errorFound = true;
        }
        if (errorFound) reject('Invalid string param ' + stringParam + ' ' + nameParam);

        resolve();
      }else {
        reject('Invalid string param ' + stringParam + ' ' + nameParam);
      }
    });
  };

  checkString(stringParam, nameParam, isRequired) {
    logger.verbose('CheckService - checkString', arguments);
    return new Promise((resolve, reject) => {
      if((typeof stringParam !== 'undefined' && typeof stringParam === 'string')  ||
        (!isRequired && typeof stringParam === 'undefined')
      ) {
        resolve();
      } else {
        reject('Invalid string param ' + stringParam + ' ' + nameParam);
      }
    });
  };

  checkNumber(numberParam, nameParam, isRequired) {
    logger.verbose('CheckService - checkNumber', arguments);
    return new Promise((resolve, reject) => {
      if((typeof numberParam !== 'undefined' && typeof numberParam === 'number')  ||
        (!isRequired && typeof numberParam === 'undefined')
      ) {
        resolve();
      } else {
        reject('Invalid number param ' + numberParam + ' ' + nameParam);
      }
    });
  };

}


module.exports = new CheckService();
