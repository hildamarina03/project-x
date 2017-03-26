/* eslint-env mocha */
'use strict';

const proxyquire =  require('proxyquire');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

let infoSpy = sinon.stub(),
  winstonMock = {
    Logger: function Logger() {
      return {
        info: infoSpy
      }
    },
    transports: {
      Console: function Console() {
        return sinon.stub();
      }
    }
  };

const logger = proxyquire('./logger', {
  'winston': winstonMock
});


/**
 * Test logger
 */
describe('logger', () => {
  describe('stream', () => {
    it('should call logger instance and print the output', () => {
      let text = 'hello';

      logger.stream.write(text);

      expect(infoSpy.calledWith(text)).to.be.true;
    });
  });
});
