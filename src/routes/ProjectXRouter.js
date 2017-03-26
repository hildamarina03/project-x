'use strict';

const express = require('express');

const ProjectXHandler = require('../handlers/ProjectXHandler');

let router = express.Router(),
  handler = new ProjectXHandler();


/* Authorization Service */
router
  .route('/functions/hello-world/:customerName')
  .get(handler.helloWorld);

/* Status Check Service */
router
  .route('/checkstatus')
  .get(handler.checkStatus);

module.exports = router;
