'use strict';

const express = require('express');

const ProjectXHandler = require('../handlers/ProjectXHandler');

let router = express.Router(),
  handler = new ProjectXHandler();


/* Authorization Service */
router
  .route('/functions/hello-world/:customerName')
  .get(handler.helloWorld);

router
  .route('/functions/create/:entity')
  .post(handler.newItem);

router
  .route('/functions/get/:entity/:id')
  .get(handler.getItem);

router
  .route('/functions/edit/:entity')
  .post(handler.editItem);

router
  .route('/functions/delete/:entity/:id')
  .get(handler.deleteItem);

router
  .route('/functions/list/:entity')
  .post(handler.listItems);

module.exports = router;
