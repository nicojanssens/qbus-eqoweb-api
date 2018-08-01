require('dotenv').config();

const constants = require('./TestConstants');
const connectP = require('../index').connectP;
const Q = require('q');

const testArgs = {
  username: constants.EQOWEB_USERNAME,
  password: constants.EQOWEB_PASSWORD,
  address: constants.EQOWEB_ADDRESS,
  port: constants.EQOWEB_PORT,
  sessionId: '4855FE45',
};

const run = (args) => {
  let nextSessionId = args.sessionId;
  connectP(args)
    .then((newSessionId) => {
      console.log(`created session ${newSessionId}`);
      nextSessionId = newSessionId;
      return Q.delay(2000);
    })
    .then(() => {
      const newArgs = Object.assign({}, args, { sessionId: nextSessionId });
      run(newArgs);
    })
    .catch((error) => {
      console.log(error);
    });
};

run(testArgs);
