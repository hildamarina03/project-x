'use strict';

const MongoDBService = require('./MongoDBService');
const CheckService = require('./CheckService');
const logger = require('../logger');


const formatTag = (tag) => { return tag.toLowerCase(); };

class TagService {

  checkParams(params) {
    return CheckService.checkString(params.title)
  }

  createTags(tags) {
    logger.verbose('TagService - createTags', arguments);
    if(typeof tags !== 'undefined' && tags.length > 0) {
      let promises = [];
      tags.forEach(tag => {
        promises.push(this.findOrSaveTag(tag))
      });

      return Promise.all(promises);
    }
    return [];
  }

  findOrSaveTag(tagTitle) {
    logger.verbose('TagService - findOrSaveTag', arguments);
    return new Promise((resolve, reject) => {
      this.findTagByTitle(tagTitle).then(result => {
        resolve(result.title);
      }, () => {
        this.createTag({title: formatTag(tagTitle)}).then(()  => {
          resolve(formatTag(tagTitle));
        }, error => {
          reject(error);
        });
      });
    });

  }

  createTag(params) {
    logger.verbose('TagService - createTag', arguments);
    return this.checkParams(params)
      .then(() => MongoDBService.insertItem("Tag", {
        title: params.title,
        active: true
      }))
  }

  findTagByTitle(title) {
    logger.verbose('TagService - findTagByTitle', arguments);
    return CheckService.checkString(title)
      .then(() => MongoDBService.findOneByTitle("Tag", formatTag(title)))
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
