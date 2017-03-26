'use strict';

const mongo = require('../mongo');

class MongoDBService {

  addCollection() {
    return new Promise((resolve, reject) => {
      const db = mongo.get();

      let collection = db.collection("simple_document_insert_collection_no_safe");
      collection.insert({hello:'world_no_safe'});

      collection.findOne({hello:'world_no_safe'}, function(err, item) {
        if(err){
          reject(err);
        }else{
          resolve(item);
        }

      })
    });
  }

  addCollectionUser() {
    return new Promise((resolve, reject) => {
      const db = mongo.get();

      let collection = db.collection('User');
      collection.insert({name:'Hilda', lastName: 'Lopez', email: 'hildamarina03@gmail.com', password: '1234'});
      collection.insert({name:'Pedro', lastName: 'Delmonte', email: 'pedro.delmonte@gmail.com', password: '1234'});
      collection.insert({name:'Roxanne', lastName: 'Rodriguez', email: 'hildamarina03@gmail.com', password: '1234'});
      collection.insert({name:'Jeroen', lastName: 'Lopez', email: 'hildamarina03@gmail.com', password: '1234'});
      collection.insert({name:'Carolina', lastName: 'Rodriguez', email: 'hildamarina03@gmail.com', password: '1234'});
      collection.insert({name:'Manuel', lastName: 'Rodriguez', email: 'marp@gmail.com', password: '1234'});

      collection.find({}).toArray().then(items => {
        resolve(items);
      });
    });
  }



  /**
   * @param entity
   * @param id
   */
  findOneById(entity, id) {
    return new Promise((resolve, reject) => {
      const db = mongo.get();

      db.collection(entity).findOne({
        _id: id
      }).then(item => {
        if (item) {
          resolve(item);
        }else{
          reject(`No object (${entity}) found`);
        }
      });
    });
  }

  /**
   * @param entity
   */
  findAll(entity) {
    return new Promise(resolve => {
      const db = mongo.get();

      db.collection(entity).find({}).toArray().then(items => {
        resolve(items);
      });
    });
  }

  /**
   *
   */
  findLastUpdatedUser() {
    return new Promise((resolve, reject) => {
      const db = mongo.get();
      db.collection('_User').findOne({type: 'company'},{ sort: [['_updated_at','desc']] }).then(user => {
        console.log(user);
        if(user && typeof user._id !== 'undefined'){
          resolve(user);
        }else{
          reject('Problem in query for user');
        }
      });
    });
  }

  /**
   *
   * @param userId
   * @param dateValue
   */
  findUserCurrentSubscription(userId, dateValue) {
    return new Promise(resolve => {

      this.findSubscriptionByUserAndStartDate(userId, dateValue).then(subscriptions => {
        const array = [];

        subscriptions.forEach(subscription => {
          if (this.isSubscriptionActive(subscription, dateValue)) {
            array.push(subscription);
          }
        });

        resolve(array);
      });
    });
  }

  /**
   *
   */
  findContractByUser(userId) {
    return new Promise((resolve, reject) => {
      const db = mongo.get();

      db.collection('Contract').findOne({
        user: userId
      }).then(item => {
        if (item) {
          resolve(item);
        }else{
          resolve({});
        }
      });
    });
  }

  /**
   * Query for entity Subscription
   *
   * @param userId
   * @param dateValue
   */
  findSubscriptionByUserAndStartDate(userId, dateValue) {
    return new Promise(resolve => {
      const db = mongo.get();

      db.collection('Subscription').find({
        user: userId,
        startDate: {
          $lte: dateValue.toDate()
        }
      }, {}).toArray().then(subscriptions => {
        resolve(subscriptions);
      });
    });
  }

  /**
   * Boolean aux function used in findUserCurrentSubscription
   *
   * @param subscription
   * @param dateValue
   */
  isSubscriptionActive(subscription, dateValue) {
    return typeof subscription.endDate === 'undefined' || subscription.endDate >= dateValue.toDate();
  }

  /**
   * Query for entity Counter
   *
   * @param accountId
   */
  findOneCounterByAccountId(accountId) {
    return new Promise(resolve => {
      const db = mongo.get();

      db.collection('Counter').findOne({
        accountId: accountId
      }).then(item => {
        if (item) {
          resolve(item);
        }else{
          resolve({});
        }
      });
    });
  }
}

module.exports = new MongoDBService();
