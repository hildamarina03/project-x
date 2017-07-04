'use strict';
const request = require('superagent');

const makeGetRequest = (url, params) => {
  return new Promise((resolve, reject) => {
    request
      .post(url)
      .set('accept', 'application/json')
      .send(params)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body.success);
        }
      });
  });
};

const userImport = () => {
  const
    results = require('./data/Users.json').results,
    promises = [],
    url = 'http://localhost:6600/projectx/functions/create/user';

  results.forEach(data => {
    const {
      id
    } = data;

    delete data.id;
    promises.push(new Promise(resolve => {
      makeGetRequest(url, data).then( () => {
        console.log('created user', id);
        resolve();
      }, () => {
        console.log('ERROR WHEN CREATING User', id);
        resolve();
      });
    }));
  });

  return Promise.all(promises);
};

const tripImport = () => {
  const
    results = require('./data/Trips.json').results,
    promises = [],
    url = 'http://localhost:6600/projectx/functions/create/trip',
    urlGetUserByEmail = 'http://localhost:6600/projectx/functions/getuser';

  results.forEach(data => {
    const {
      id,
      userEmail
    } = data;

    delete data.id;
    delete data.userEmail;
    promises.push(new Promise(resolve => {

      makeGetRequest(urlGetUserByEmail, { email: userEmail }).then( user => {
        data.userId = user.object._id;
        makeGetRequest(url, data).then( () => {
          console.log('created trip', id);
          resolve();
        }, () => {
          console.log('ERROR WHEN CREATING TRIP', id);
          resolve();
        });
      }, () => {
        console.log('ERROR WHEN CREATING TRIP', id);
        resolve();
      });
    }));
  });

  return Promise.all(promises);
};

const importAll = () => {
  return userImport()
    .then( tripImport());
};

importAll().then(() => {

}, error => {
  console.log('error');
});

