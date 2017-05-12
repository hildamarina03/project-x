'use strict';

module.exports = {
  appUrl: process.env.APP_URL,
  appPort: process.env.PORT || 6600,
  appSecret: process.env.SECRET || 'mysecretforprojectx',
  mongoURL: process.env.DATABASE_URI || 'mongodb://mongo/projectx',
  required: true,
  notRequired: false
};
