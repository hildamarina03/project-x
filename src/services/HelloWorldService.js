'use strict';


class HelloWorldService {
  sayHello(name) {
    const promise = new Promise((resolve) => {
     resolve('HELLO '+name+'!');
    });
    return promise;
  }
}

module.exports = new HelloWorldService();
