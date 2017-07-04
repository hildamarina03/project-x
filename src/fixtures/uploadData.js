'use strict';
const request = require('superagent');
const
  entities = [
    'Tag',
    'Item',
    'Trip',
    'User',
    'Comment',
    'Like'
  ];

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

const dropAll = () => {
  const promises = [];

  entities.forEach(entity => {
    promises.push(new Promise(resolve => {
      makeGetRequest('http://localhost:6600/projectx/functions/drop/collection', { entity: entity}).then( () => {
        console.log('Dropped collection:', entity);
        resolve();
      }, () => {
        console.log('********Warning: Problem to drop collection:', entity, '. -- Probably collection did not existed.');
        resolve()
      });

    }));

  });
  return Promise.all(promises);
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

const itemImport = () => {
  const
    results = require('./data/Items.json').results,
    promises = [],
    url = 'http://localhost:6600/projectx/functions/create/item',
    urlGetUserByEmail = 'http://localhost:6600/projectx/functions/getuser',
    urlGetTripByTitle = 'http://localhost:6600/projectx/functions/gettrip';

  results.forEach(data => {
    const {
      id,
      userEmail,
      tripTitle
    } = data;

    delete data.id;
    delete data.userEmail;
    delete data.tripTitle;
    promises.push(new Promise(resolve => {

      makeGetRequest(urlGetUserByEmail, { email: userEmail }).then( user => {
        data.userId = user.object._id;
        makeGetRequest(urlGetTripByTitle, { title: tripTitle }).then(trip => {
          data.tripId = trip.object._id;
          makeGetRequest(url, data).then( () => {
            console.log('created item', id);
            resolve();
          }, () => {
            console.log('ERROR WHEN CREATING ITEM', id);
            resolve();
          });
        }, error => {
          console.log('ERROR WHEN CREATING ITEM', id, '(problem with trip)');
          resolve();
        });
      }, () => {
        console.log('ERROR WHEN CREATING ITEM', id, '(problem with user)');
        resolve();
      });
    }));
  });

  return Promise.all(promises);
};


const importAll = () => {
  return dropAll()
    .then(() => userImport())
    .then(() => tripImport())
    .then(() => itemImport());
};

importAll().then(() => {
  console.log('All data imported');
}, error => {
  console.log('error', error);
});

