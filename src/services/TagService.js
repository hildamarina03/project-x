'use strict';

const MongoDBService = require('./MongoDBService');
const CheckService = require('./CheckService');


class TagService {

  checkParams(params) {
    return CheckService.checkString(params.title)
  }

  createTag(params) {
    return this.checkParams(params)
      .then(() => MongoDBService.insertTag("Tag", {
        title: params.title,
        active: true
      }))
  }

  getTag(id) {
    return CheckService.checkString(id)
      .then(() => MongoDBService.findOneById("Tag", id))
  }

  editTag(params) {
    return this.checkParams(params)
      .then(() => CheckService.checkString(params._id))
      .then(() => MongoDBService.editTag("Tag", params._id, {
        title: params.title,
        active: true
      }))
  }

  softDeleteTag(id) {
    return CheckService.checkString(id)
      .then(() => this.getTag(id))
      .then(tag => MongoDBService.editTag("Tag", id, {
        title: tag.title,
        active: false
      }))
  }

  listAllTags() {
    return MongoDBService.findAll("Tag")
  }
}

module.exports = new TagService();
