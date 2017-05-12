'use strict';

const MongoDBService = require('./MongoDBService');
const CheckService = require('./CheckService');
const TagService = require('./TagService');
const {required, notRequired } = require('.././config');
const logger = require('../logger');



class TripService {

  checkParams(params) {
    logger.verbose('TripService - checkParams', arguments);
    return CheckService.checkString(params.location, 'location', required)
      .then(() => CheckService.checkUser(params.userId, 'userId', notRequired)) //TODO should be required
      .then(() => CheckService.checkString(params.title, 'title', notRequired))
      .then(() => CheckService.checkString(params.imageURL, 'imageURL', notRequired))
      .then(() => CheckService.checkNumber(params.startDate, 'startDate', notRequired))
      .then(() => CheckService.checkNumber(params.endDate, 'endDate', notRequired))
      .then(() => CheckService.checkStringArray(params.tags, 'tags', notRequired))
  }

  createTrip(params) {
    logger.verbose('TripService - createTrip', arguments);
    return this.checkParams(params)
      .then(() => TagService.createTags(params.tags))
      .then(tags => {
        return MongoDBService.insertItem("Trip", {
          location: params.location,
          userId: params.userId,
          title: params.title,
          imageURL: params.imageURL,
          startDate: params.startDate,
          endDate: params.endDate,
          tags: tags,
          active: true
        })
      })
  }

  getTrip(id) {
    logger.verbose('TripService - getTrip', arguments);
    return CheckService.checkString(id)
      .then(() => MongoDBService.findOneById("Trip", id))
      .then(trip => {
        let x;
        return {
          location: trip.location || x,
          title: trip.title || x,
          imageURL: trip.imageURL || x,
          startDate: trip.startDate || x,
          endDate: trip.endDate || x,
          tags: trip.tags || x
        }
      })
  }

  editTrip(params) {
    logger.verbose('TripService - editTrip', arguments);
    return this.checkParams(params)
      .then(() => CheckService.checkString(params._id))
      .then(() => MongoDBService.editItem("Trip", params._id, {
        location: params.location,
        userId: params.userId,
        title: params.title,
        imageURL: params.imageURL,
        startDate: params.startDate,
        endDate: params.endDate,
        tags: tags,
        active: true
      }))
  }

  softDeleteTrip(id) {
    return CheckService.checkString(id)
      .then(() => this.getTrip(id))
      .then(trip => MongoDBService.editItem("Trip", id, {
        destination: trip.destination,
        description: trip.description,
        picture: trip.picture,
        active: false
      }))
  }

  listAllTrips() {
    return MongoDBService.findAll("Trip")
  }
}

module.exports = new TripService();
