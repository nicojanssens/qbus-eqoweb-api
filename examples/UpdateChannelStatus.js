require('dotenv').config();

const constants = require('./TestConstants');
const { connectP, updateChannelStatusP } = require('../index');

const testArgs = {
  username: constants.EQOWEB_USERNAME,
  password: constants.EQOWEB_PASSWORD,
  address: constants.EQOWEB_ADDRESS,
  port: constants.EQOWEB_PORT,
  channelId: constants.TEST_CHANNEL_ID,
};

connectP(testArgs)
  .then((sessionId) => {
    console.log(`created session ${sessionId}`);
    testArgs.newStatus = [255];
    testArgs.sessionId = sessionId;
    return updateChannelStatusP(testArgs);
  })
  .then((channelStatus) => {
    console.log(`received channel status ${JSON.stringify(channelStatus)}`);
  })
  .catch((error) => {
    console.log(error);
  });
