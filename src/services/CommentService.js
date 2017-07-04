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

class CommentService {

  checkParams(params) {
    logger.verbose('CommentService - checkParams', arguments);
    return CheckService.checkString(params.message, 'message', required)
      .then(() => CheckService.checkUser(params.userId, 'userId', required))
      .then(() => CheckService.checkItem(params.itemId, 'itemId', required))
  }

  createComment(params) {
    logger.verbose('CommentService - createComment', arguments);
    return this.checkParams(params)
      .then(() => ItemService.incrementCommentCounter(params.itemId))
      .then(() =>  MongoDBService.insertItem("Comment", {
          userId: params.userId,
          message: params.message,
          itemId: params.itemId,
          time: moment().valueOf()
        })
      )
  }

  getCommentsByItemId(itemId) {
    logger.verbose('CommentService - getCommentsByItemId', arguments);
    return CheckService.checkItem(itemId)
      .then(() => MongoDBService.findAllByItemId("Comment", itemId, {sortBy: 'time'} ))
      .then(items => {
        return items.map(view);
      })
  }

  listAllComments() {
    return MongoDBService.findAll("Comment")
  }

}

module.exports = new CommentService();
