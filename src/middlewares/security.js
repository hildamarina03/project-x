'use strict';

const config = require('../config');

/**
 * Very trivial security check for checking the presence
 * of a secret in http request headers. this MUST be used
 * with TLS connection in order to make it usable.
 * The header name is "Identity"
 */
module.exports = (req, res, next) => {
  if (req.header('x-cj-identity') !== config.appSecret) {
    res.status(403).send({
      error: 'Invalid secret'
    });
  } else {
    next();
  }
}
