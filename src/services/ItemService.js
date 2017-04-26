'use strict';

const MongoDBService = require('./MongoDBService');
const CheckService = require('./CheckService');


class ItemService {

  checkParams(params) {
    return CheckService.checkString(params.title)
      .then(() => CheckService.checkString(params.description))
      .then(() => CheckService.checkString(params.picture))
  }

  createItem(params) {
    return this.checkParams(params)
      .then(() => MongoDBService.insertItem("Item", {
        title: params.title,
        description: params.description,
        picture: params.picture,
        active: true
      }))
  }

  getItem(id) {
    return CheckService.checkString(id)
      .then(() => MongoDBService.findOneById("Item", id))
  }

  editItem(params) {
    return this.checkParams(params)
      .then(() => CheckService.checkString(params._id))
      .then(() => MongoDBService.editItem("Item", params._id, {
        title: params.title,
        description: params.description,
        picture: params.picture,
        active: true
      }))
  }

  softDeleteItem(id) {
    return CheckService.checkString(id)
      .then(() => this.getItem(id))
      .then(item => MongoDBService.editItem("Item", id, {
        title: item.title,
        description: item.description,
        picture: item.picture,
        active: false
      }))
  }

  listAllItems() {
    return MongoDBService.findAll("Item")
  }
}

module.exports = new ItemService();
