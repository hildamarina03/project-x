'use strict';

const moment = require('moment');
const StatusService = require('../services/StatusService');
const HelloWorldService = require('../services/HelloWorldService');

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

  checkStatus(req, res) {
    const
      currentDate = moment().utc();

    console.log('checkStatus called at', currentDate.toDate());
    StatusService.check(currentDate).then(result => {
      console.log('checkStatus result', result);
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
