'use strict';

const MongoDBService = require('./MongoDBService');
const CheckService = require('./CheckService');
const logger = require('../logger');
const {required, notRequired } = require('.././config');

const view = (item) => {
  let x;
  return {
    id: item._id,
    username: item.username || x,
    name: item.name || x,
    lastName: item.lastName || x
  }
};


class UserService {

  checkParams(params) {
    return CheckService.checkString(params.username, "username", required)
      .then(() => CheckService.checkString(params.name, "name", required))
      .then(() => CheckService.checkString(params.lastName, "lastName", required))
      .then(() => CheckService.checkString(params.password, "password", required))
  }

  createUser(params) {
    return this.checkParams(params)
      .then(() => MongoDBService.insertItem("User", {
        username: params.username,
        name: params.name,
        lastName: params.lastName,
        password: params.password,
        active: true
      }))
  }

  getUser(id) {
    logger.verbose('UserService - getUser', arguments);
    return CheckService.checkString(id)
      .then(() => MongoDBService.findOneById("User", id))
      .then(user => { return view(user) } )
  }

  getUserByEmail(email) {
    return CheckService.checkString(email, "userEmail", true)
      .then(() => MongoDBService.findOneByEmail("User", email))
  }

  editUser(params) {
    logger.verbose('UserService - editUser', arguments);
    return this.checkParams(params)
      .then(() => CheckService.checkString(params.id, "id", required))
      .then(() => this.getUser(params.id))
      .then(user =>  {
        MongoDBService.editItem("User", params.id, {
          username: params.username || user.username,
          name: params.name || user.name,
          lastName: params.lastName || user.lastName,
          password: params.password || user.password,
          active: true
        })
      })
  }

  login(username, password) {
    logger.verbose('UserService - login', arguments);
    return CheckService.checkString(username, "username", required)
      .then(() => CheckService.checkString(password, "password", required))
      .then(() => this.getUserByEmail(username))
      .then(user => {
        if(user.password === password){
          return(user._id)
        }
        return('Invalid username or password')
      });

  }

  softDeleteUser(id) {
    logger.verbose('UserService - softDeleteItem', arguments);
    return CheckService.checkString(id, "id", required)
      .then(() => this.getUser(id))
      .then(item => {
        item.active = false;
        return MongoDBService.editItem("User", id, item)
      })
  }

  listAllUsers() {
    return MongoDBService.findAll("User")
  }
}

module.exports = new UserService();
