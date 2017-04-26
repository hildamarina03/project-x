'use strict';

const MongoDBService = require('./MongoDBService');
const CheckService = require('./CheckService');


class UserService {

  checkParams(params) {
    return CheckService.checkString(params.username)
      .then(() => CheckService.checkString(params.name))
      .then(() => CheckService.checkString(params.lastname))
      .then(() => CheckService.checkString(params.picture))
      .then(() => CheckService.checkString(params.password))
  }

  createUser(params) {
    return this.checkParams(params)
      .then(() => MongoDBService.insertItem("User", {
        username: params.username,
        name: params.name,
        lastname: params.lastname,
        picture: params.picture,
        password: params.password,
        active: true
      }))
  }

  getUser(id) {
    return CheckService.checkString(id)
      .then(() => MongoDBService.findOneById("User", id))
  }

  editUser(params) {
    return this.checkParams(params)
      .then(() => CheckService.checkString(params._id))
      .then(() => MongoDBService.editItem("User", params._id, {
        username: params.username,
        name: params.name,
        lastname: params.lastname,
        picture: params.picture,
        password: params.password,
        active: true
      }))
  }

  softDeleteUser(id) {
    return CheckService.checkString(id)
      .then(() => this.getUser(id))
      .then(user => MongoDBService.editItem("User", id, {
        username: user.username,
        name: user.name,
        lastname: user.lastname,
        picture: user.picture,
        password: user.password,
        active: false
      }))
  }

  listAllUsers() {
    return MongoDBService.findAll("User")
  }
}

module.exports = new UserService();
