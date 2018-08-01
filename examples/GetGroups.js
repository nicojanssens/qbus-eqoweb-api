require('dotenv').config();

const constants = require('./TestConstants');
const connectP = require('../index').connectP;
const getGroupsP = require('../index').getGroupsP;

const testArgs = {
  username: constants.EQOWEB_USERNAME,
  password: constants.EQOWEB_PASSWORD,
  address: constants.EQOWEB_ADDRESS,
  port: constants.EQOWEB_PORT,
};

connectP(testArgs)
  .then((sessionId) => {
    console.log(`created session ${sessionId}`);
    testArgs.sessionId = sessionId;
    return getGroupsP(testArgs);
  })
  .then((groups) => {
    console.log(`received groups ${JSON.stringify(groups)}`);
  })
  .catch((error) => {
    console.log(error);
  });
