'use strict';

const MongoDBService = require('./MongoDBService');
const CheckService = require('./CheckService');


class TripService {

  checkParams(params) {
    return CheckService.checkString(params.destination)
      .then(() => CheckService.checkString(params.description))
      .then(() => CheckService.checkString(params.picture))
  }

  createTrip(params) {
    return this.checkParams(params)
      .then(() => MongoDBService.insertItem("Trip", {
        destination: params.destination,
        description: params.description,
        picture: params.picture,
        active: true
      }))
  }

  getTrip(id) {
    return CheckService.checkString(id)
      .then(() => MongoDBService.findOneById("Trip", id))
  }

  editTrip(params) {
    return this.checkParams(params)
      .then(() => CheckService.checkString(params._id))
      .then(() => MongoDBService.editItem("Trip", params._id, {
        destination: params.destination,
        description: params.description,
        picture: params.picture,
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
