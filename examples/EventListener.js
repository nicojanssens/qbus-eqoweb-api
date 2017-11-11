require('dotenv').config();

const constants = require('./Constants');
const EventListener = require('../index').EventListener;

const testArgs = {
  username: constants.EQOWEB_USERNAME,
  password: constants.EQOWEB_PASSWORD,
  address: constants.EQOWEB_ADDRESS,
  port: constants.EQOWEB_PORT,
};

const listener = new EventListener(testArgs);
listener.on('update', (update) => {
  console.log(update);
});
listener.activate();
