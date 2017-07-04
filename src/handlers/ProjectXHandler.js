'use strict';

const moment = require('moment');
const TripService = require('../services/TripService');
const TagService = require('../services/TagService');
const UserService = require('../services/UserService');
const ItemService = require('../services/ItemService');
const CommentService = require('../services/CommentService');
const LikeService = require('../services/LikeService');
const HelloWorldService = require('../services/HelloWorldService');
const MongoDBService = require('../services/MongoDBService');


const createTrip = (params) => { return TripService.createTrip(params) };
const createItem = (params) => { return ItemService.createItem(params) };
const createTag = (params) => { return TagService.createTag(params) };
const createUser = (params) => { return UserService.createUser(params) };
const createComment = (params) => { return CommentService.createComment(params) };
const createLike = (params) => { return LikeService.createLike(params) };

const getTrip = (params) => { return TripService.getTrip(params) };
const getItem = (params) => { return ItemService.getItem(params) };
const getTag = (params) => { return TagService.getTag(params) };
const getUser = (params) => { return UserService.getUser(params) };

const editTrip = (params) => { return TripService.editTrip(params) };
const editItem = (params) => { return ItemService.editItem(params) };
const editTag = (params) => { return TagService.editTag(params) };
const editUser = (params) => { return UserService.editUser(params) };

const deleteTrip = (params) => { return TripService.softDeleteTrip(params) };
const deleteItem = (params) => { return ItemService.softDeleteItem(params) };
const deleteTag = (params) => { return TagService.softDeleteTag(params) };
const deleteUser  = (params) => { return UserService.softDeleteUser(params) };

const listAllTrip = () => { return TripService.listAllTrips() };
const listAllItem = () => { return ItemService.listAllItems() };
const listAllTag = () => { return TagService.listAllTags() };
const listAllUser = () => { return UserService.listAllUsers() };
const listAllComment = () => { return CommentService.listAllComments() };
const listAllLike = () => { return LikeService.listAllLikes() };

const typeService = {
  create: {
    trip: createTrip,
    item: createItem,
    tag: createTag,
    user: createUser,
    comment: createComment,
    like: createLike
  },
  get: {
    trip: getTrip,
    item: getItem,
    tag: getTag,
    user: getUser
  },
  edit: {
    trip: editTrip,
    item: editItem,
    tag: editTag,
    user: editUser
  },
  delete: {
    trip: deleteTrip,
    item: deleteItem,
    tag: deleteTag,
    user: deleteUser
  },
  list: {
    trip: listAllTrip,
    item: listAllItem,
    tag: listAllTag,
    user: listAllUser,
    comment: listAllComment,
    like: listAllLike
  }
};



class ProjectXHandler {
  helloWorld(req, res) {
    const
      customerName = req.params.customerName;

    if (customerName) {
      HelloWorldService.sayHello(customerName).then(result => {
        res.json({
          success: result
        });
      }, error => {
        res.status(400).json({
          error: error
        });
      });
    } else {
      res.status(400).json({
        error: 'Bad parameters'
      });
    }
  }

  newItem(req, res) {
    const
      entity = req.params.entity,
      data = req.body;

    typeService.create[entity](data).then(result => {
      console.log('create result', result);
      res.json({
        success: {
          id: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });
  }

  getItem(req, res) {
    const
      entity = req.params.entity,
      id = req.params.id;

    typeService.get[entity](id).then(result => {
      console.log('get result', result);
      res.json({
        success: {
          objectType: entity,
          object: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });

  }

  editItem(req, res) {
    const
      entity = req.params.entity,
      data = req.body;

    typeService.edit[entity](data).then(result => {
      console.log('edit result', result);
      res.json({
        success: {
          id: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });
  }

  deleteItem(req, res) {
    const
      entity = req.params.entity,
      id = req.params.id;

    typeService.delete[entity](id).then(result => {
      console.log('deleteTrip result', result);
      res.json({
        success: {
          tripId: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });

  }

  listItems(req, res) {
    const
      entity = req.params.entity;

    typeService.list[entity]().then(result => {
      console.log('listAllTrips result', result);
      res.json({
        success: {
          objectType: entity,
          objects: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });
  }

  getTripItems(req, res) {
    const
      tripId = req.params.tripId,
      params = req.body;

    ItemService.getItemsByTripId(tripId, params).then(result => {
      console.log('getTripItems', result);
      res.json({
        success: {
          objectType: 'item',
          objects: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });

  }

  getUserTrips(req, res) {
    const
      userId = req.params.userId;

    TripService.getTripsByUserId(userId).then(result => {
      console.log('getTripsByUserId', result);
      res.json({
        success: {
          objectType: 'trip',
          objects: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });

  }

  getItemComments(req, res) {
    const
      itemId = req.params.itemId;

    CommentService.getCommentsByItemId(itemId).then(result => {
      console.log('getItemComments', result);
      res.json({
        success: {
          objectType: 'comment',
          objects: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });

  }

  getUserByEmail(req, res) {
    const
      userEmail = req.body.email;

    UserService.getUserByEmail(userEmail).then(result => {
      console.log('getUserByEmail', result);
      res.json({
        success: {
          objectType: 'user',
          object: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });

  }

  getTripByTitle(req, res) {
    const
      tripTitle = req.body.title;

    TripService.getTripByTitle(tripTitle).then(result => {
      console.log('getTripByTitle', result);
      res.json({
        success: {
          objectType: 'trip',
          object: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });

  }

  login(req, res) {
    const
      username = req.body.username,
      password = req.body.password;

    UserService.login(username, password).then(result => {
      if(result === 'Invalid username or password'){
        res.status(400).json({
          error: result
        });
      }
      console.log('login', result);
      res.json({
        success: {
          id: result
        }
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });

  }

  dropCollection(req, res) {
    const
      entity = req.body.entity;
      MongoDBService.dropCollection(entity).then(result => {
      console.log('dropCollection:', entity, result);
      res.json({
        success: result
      });
    }, error => {
      res.status(400).json({
        error: error
      });
    });

  }

}

module.exports = ProjectXHandler;
