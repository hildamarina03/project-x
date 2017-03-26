'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const config = require('./config');
const ProjectXRouter = require('./routes/ProjectXRouter');
const logger = require('./logger');
const security = require('./middlewares/security');
const mongo = require('./mongo');

const app = express();

app.use('/projectx', security);

app.use(bodyParser.json());

app.use('/apidoc', express.static('apidoc'));

app.get('/', (req, res) => {
  res.send('Project-X is running..');
});

app.get('/ping', (req, res) => {
  res.send('ping');
});

app.use('/projectx', ProjectXRouter);

module.exports.start = () => {
  const port = config.appPort;
  MongoClient.connect(config.mongoURL, (error, db) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info('Connected to mongoMDB');
      mongo.set(db);
      app.listen(port, () => {
        logger.info(`Project-X running on ${port}`);
      });
    }
  });
};

module.exports.app = app;
