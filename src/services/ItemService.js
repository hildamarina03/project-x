'use strict';

const MongoDBService = require('./MongoDBService');
const CheckService = require('./CheckService');
const TagService = require('./TagService');
const {required, notRequired } = require('.././config');
const logger = require('../logger');

const view = (item) => {
  let x;
  return {
    title: item.title || x,
    description: item.description || x,
    location: item.location || x,
    imageURL: item.imageURL || x,
    startDate: item.startDate || x,
    endDate: item.endDate || x,
    tags: item.tags || x,
    numberOfComments: item.numberOfComments || x,
    price: item.price || x,
    numberOfLikes: item.numberOfLikes || x,
    multipleDays: item.multipleDays || x,
    time: item.time || x,
    userId: item.userId || x
  }
};

class ItemService {

  checkParams(params) {
    logger.verbose('ItemService - checkParams', arguments);
    return CheckService.checkString(params.title, 'title', required)
      .then(() => CheckService.checkUser(params.userId, 'userId', notRequired)) //TODO should be required
      .then(() => CheckService.checkTrip(params.tripId, 'tripId', required))
      .then(() => CheckService.checkString(params.description, 'description', notRequired))
      .then(() => CheckService.checkString(params.imageURL, 'imageURL', notRequired))
      .then(() => CheckService.checkString(params.location, 'location', notRequired))
      .then(() => CheckService.checkNumber(params.startDate, 'startDate', notRequired))
      .then(() => CheckService.checkNumber(params.endDate, 'endDate', notRequired))
      .then(() => CheckService.checkNumber(params.numberOfComments, 'numberOfComments', notRequired))
      .then(() => CheckService.checkNumber(params.price, 'price', notRequired))
      .then(() => CheckService.checkNumber(params.numberOfLikes, 'numberOfLikes', notRequired))
      .then(() => CheckService.checkBoolean(params.multipleDays, 'multipleDays', notRequired))
      .then(() => CheckService.checkStringArray(params.tags, 'tags', notRequired))
      .then(() => CheckService.checkNumber(params.time, 'time', notRequired))
  }

  createItem(params) {
    logger.verbose('ItemService - createItem', arguments);
    return this.checkParams(params)
      .then(() => TagService.createTags(params.tags))
      .then(tags => {
        return MongoDBService.insertItem("Item", {
          title: params.title,
          userId: params.userId,
          tripId: params.tripId,
          description: params.description,
          location: params.location,
          imageURL: params.imageURL,
          startDate: params.startDate,
          endDate: params.endDate,
          numberOfComments: params.numberOfComments,
          price: params.price,
          numberOfLikes: params.numberOfLikes,
          multipleDays: params.multipleDays,
          time: params.time,
          tags: tags,
          active: true
        })
      })
  }

  getItem(id) {
    logger.verbose('ItemService - getItem', arguments);
    return CheckService.checkString(id)
      .then(() => MongoDBService.findOneById("Item", id))
      .then(item => { return view(item) } )
  }

  getItemsByTripId(tripId, params) {
    logger.verbose('ItemService - getItemsByTripId', arguments);
    return CheckService.checkTrip(tripId)
      .then(() => MongoDBService.findAllByTripId("Item", tripId, params))
      .then(items => {
        return items.map(view);
      })
  }

  editItem(params) {
    logger.verbose('ItemService - editItem', arguments)
    return this.checkParams(params)
      .then(() => CheckService.checkString(params._id, "_id", required))
      .then(() => TagService.createTags(params.tags))
      .then(tags => {
        return this.getItem(params._id)
        .then(item => MongoDBService.editItem("Item", params._id, {
          title: params.title,
          userId: params.userId,
          tripId: params.tripId,
          description: params.description,
          location: params.location,
          imageURL: params.imageURL,
          startDate: params.startDate,
          endDate: params.endDate,
          price: params.price,
          multipleDays: params.multipleDays,
          time: params.time,
          tags: tags,
          numberOfComments: item.numberOfComments,
          numberOfLikes: item.numberOfLikes,
          active: true
        }))
      })
  }

  softDeleteItem(id) {
    logger.verbose('ItemService - softDeleteItem', arguments)
    return CheckService.checkString(id)
      .then(() => this.getItem(id))
      .then(item => {
        item.active = false;
        MongoDBService.editItem("Item", id, item)
      })
  }

  incrementCommentCounter(id) {
    logger.verbose('ItemService - incrementCommentCounter', arguments)
    return CheckService.checkString(id)
      .then(() => this.getItem(id))
      .then(item => {
        item.numberOfComments = item.numberOfComments || 0;
        item.numberOfComments = item.numberOfComments + 1;
        MongoDBService.editItem("Item", id, item)
      })
  }

  incrementLikesCounter(id) {
    logger.verbose('ItemService - incrementCommentCounter', arguments)
    return CheckService.checkString(id)
      .then(() => this.getItem(id))
      .then(item => {
        item.numberOfLikes = item.numberOfLikes || 0;
        item.numberOfLikes = item.numberOfLikes + 1;
        MongoDBService.editItem("Item", id, item)
      })
  }

  listAllItems() {
    return MongoDBService.findAll("Item")
  }
}

module.exports = new ItemService();
