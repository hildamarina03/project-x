'use strict';

const moment = require('moment');
const TripService = require('../services/TripService');
const TagService = require('../services/TagService');
const UserService = require('../services/UserService');
const ItemService = require('../services/ItemService');
const CommentService = require('../services/CommentService');
const LikeService = require('../services/LikeService');
const HelloWorldService = require('../services/HelloWorldService');


const createTrip = (params) => { return TripService.createTrip(params) };
const createItem = (params) => { return ItemService.createItem(params) };
const createUser = (params) => { return TagService.createTag(params) };
const createTag = (params) => { return UserService.createUser(params) };
const createComment = (params) => { return CommentService.createComment(params) };
const createLike = (params) => { return LikeService.createLike(params) };

const getTrip = (params) => { return TripService.getTrip(params) };
const getItem = (params) => { return ItemService.getItem(params) };
const getUser = (params) => { return TagService.getTag(params) };
const getTag = (params) => { return UserService.getUser(params) };

const editTrip = (params) => { return TripService.editTrip(params) };
const editItem = (params) => { return ItemService.editItem(params) };
const editUser = (params) => { return TagService.editTag(params) };
const editTag = (params) => { return UserService.editUser(params) };

const deleteTrip = (params) => { return TripService.softDeleteTrip(params) };
const deleteItem = (params) => { return ItemService.softDeleteItem(params) };
const deleteUser = (params) => { return TagService.softDeleteTag(params) };
const deleteTag = (params) => { return UserService.softDeleteUser(params) };

const listAllTrip = (params) => { return TripService.listAllTrips(params) };
const listAllItem = (params) => { return ItemService.listAllItems(params) };
const listAllUser = (params) => { return TagService.listAllTags(params) };
const listAllTag = (params) => { return UserService.listAllUsers(params) };

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
    user: listAllUser
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
      entity = req.params.entity,
      data = req.body;

    typeService.list[entity](data).then(result => {
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

}

module.exports = ProjectXHandler;
