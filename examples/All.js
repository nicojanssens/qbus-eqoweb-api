require('dotenv').config();

const constants = require('./TestConstants');
const connectP = require('../index').connectP;
const getGroupsP = require('../index').getGroupsP;
const getChannelStatusP = require('../index').getChannelStatusP;
const updateChannelStatusP = require('../index').updateChannelStatusP;

const testArgs = {
  username: constants.EQOWEB_USERNAME,
  password: constants.EQOWEB_PASSWORD,
  address: constants.EQOWEB_ADDRESS,
  port: constants.EQOWEB_PORT,
};

const findChannelId = (groups, name) => {
  let channelId;
  groups.forEach((group) => {
    const channelItem = group.Itms.find(item => (
      item.Nme === name
    ));
    if (channelItem) {
      channelId = channelItem.Chnl;
    }
  });
  return channelId;
};

const run = () => {
  let sessionId;
  let channelId;

  connectP(testArgs)
    .then((newSessionId) => {
      console.log(`created session ${newSessionId}`);
      sessionId = newSessionId;
      const args = Object.assign({}, testArgs, { sessionId });
      return getGroupsP(args);
    })
    .then((groups) => {
      console.log(`received groups ${JSON.stringify(groups)}`);
      const channelName = constants.TEST_CHANNEL_NAME;
      channelId = findChannelId(groups, channelName);
      if (!channelId) {
        throw new Error(`no channel id matching with ${channelName}`);
      }
      const args = Object.assign({}, testArgs, { sessionId, channelId });
      return getChannelStatusP(args);
    })
    .then((channelStatus) => {
      console.log(`received channel status ${JSON.stringify(channelStatus)}`);
      const args = Object.assign({}, testArgs, { sessionId, channelId, newStatus: [255] });
      return updateChannelStatusP(args);
    })
    .then((channelStatus) => {
      console.log(`received channel status ${JSON.stringify(channelStatus)}`);
    })
    .catch((error) => {
      console.log(error);
    });
};

run();
