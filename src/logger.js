'use strict';

const winston = require('winston');

winston.emitErrs = true;

const logger = new winston.Logger({
  transports: [
    /*
     * Uncomment if you want log files
     *
    new winston.transports.File({
      level: 'info',
      filename: './logs/info.log',
      handleExceptions: true,
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    })
    */
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;

module.exports.stream = {
  write: message => {
    logger.info(message);
  }
};
