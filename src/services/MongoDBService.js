'use strict';

const mongo = require('../mongo');
const ObjectID = require('mongodb').ObjectID;
const logger = require('../logger');


class MongoDBService {

  insertItem(entity, item) {
    return new Promise((resolve, reject) => {
      const db = mongo.get();

      db.collection(entity).insert(item, (err, item) => {
        if(err){
          reject(err);
        }else{
          resolve(item.ops[0]._id);
        }
      });
    });
  }

  findOneById(entity, id) {
    return new Promise((resolve, reject) => {
      const db = mongo.get();

      db.collection(entity).findOne({
        _id: new ObjectID(id),
      }).then(item => {
        if (item) {
          resolve(item);
        }else{
          reject(`No object (${entity}) found`);
        }
      });
    });
  }

  findOneByTitle(entity, title) {
    return new Promise((resolve, reject) => {
      const db = mongo.get();

      db.collection(entity).findOne({
        title: title,
      }).then(item => {
        if (item) {
          resolve(item);
        }else{
          reject(`No object (${entity}) found`);
        }
      });
    });
  }

  findOneByEmail(entity, mail) {
    return new Promise((resolve, reject) => {
      const db = mongo.get();

      db.collection(entity).findOne({
        username: mail,
      }).then(item => {
        if (item) {
          resolve(item);
        }else{
          reject(`No object (${entity}) found`);
        }
      });
    });
  }

  editItem(entity, id, item) {
    return new Promise((resolve, reject) => {
      const db = mongo.get();

      db.collection(entity).update({
        _id: new ObjectID(id),
      }, item, (err, item) => {
        if(err){
          reject(err);
        }else{
          resolve(id);
        }
      });
    });
  }

  findAll(entity) {
    return new Promise(resolve => {
      const db = mongo.get();

      db.collection(entity).find({}).toArray().then(items => {
        resolve(items);
      });
    });
  }

  findAllByTripId(entity, tripId, params) {
    return new Promise(resolve => {
      const sort = params.sortBy || '_id';
      let query = {
        tripId: tripId,
        active: true
      };

      if(params.dateFilter){
        query.startDate =  {"$lte":  params.dateFilter };
        query.endDate =  {"$gte":  params.dateFilter};
      }

      const db = mongo.get();
      db.collection(entity).find(query, { sort: sort }).toArray().then(items => {
        resolve(items);
      });
    });
  }

  findAllByUserId(entity, userId) {
    return new Promise(resolve => {
      const db = mongo.get();

      db.collection(entity).find({
        userId: userId,
        active: true
      }).toArray().then(items => {
        resolve(items);
      });
    });
  }

  findAllByItemId(entity, itemId, params) {
    return new Promise(resolve => {
      const db = mongo.get();
      const sort = params.sortBy || '_id';

      db.collection(entity).find({
        itemId: itemId
      }, { sort: sort }).toArray().then(items => {
        resolve(items);
      });
    });
  }

  doILikeIt(entity, itemId, userId) {
    return new Promise(resolve => {
      const db = mongo.get();

      db.collection(entity).findOne({
        itemId: itemId,
        userId: userId
      }).then(item => {
        if (item && item._id) {
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  }
}

module.exports = new MongoDBService();
