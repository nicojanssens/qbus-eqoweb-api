const constants = require('./TestConstants');
const connectP = require('../index').connectP;

const testArgs = {
  username: constants.EQOWEB_USERNAME,
  password: constants.EQOWEB_PASSWORD,
  address: constants.EQOWEB_ADDRESS,
  port: constants.EQOWEB_PORT,
};

connectP(testArgs)
  .then((sessionId) => {
    console.log(`created session ${sessionId}`);
  })
  .catch((error) => {
    console.log(error);
  });
