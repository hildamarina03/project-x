'use strict';

const moment = require('moment');
const MongoDBService = require('./MongoDBService');
const ItemService = require('./ItemService');
const CheckService = require('./CheckService');
const {required, notRequired } = require('.././config');
const logger = require('../logger');

const view = (item) => {
  let x;
  return {
    userId: item.userId || x,
    message: item.message || x
  }
};

class LikeService {

  checkParams(params) {
    logger.verbose('LikeService - checkParams', arguments);
    return CheckService.checkUser(params.userId, 'userId', required)
      .then(() => CheckService.checkItem(params.itemId, 'itemId', required))
  }

  createLike(params) {
    logger.verbose('LikeService - createLike', arguments);
    return this.checkParams(params)
      .then(() => ItemService.incrementLikesCounter(params.itemId))
      .then(() =>  MongoDBService.insertItem("Like", {
          userId: params.userId,
          itemId: params.itemId
        })
      )
  }

  doILikeIt(userId, itemId) {
    logger.verbose('LikeService - doIlikeIt', arguments);
    return MongoDBService.doILikeIt("Like", itemId, userId)
  }

  listAllLikes() {
    return MongoDBService.findAll("Like")
  }

}

module.exports = new LikeService();
