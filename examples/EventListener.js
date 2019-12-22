require('dotenv').config();

const constants = require('./TestConstants');
const { EventListener } = require('../index');

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
listener.on('error', (error) => {
  console.log(`Woops ... ${error}`);
});
listener.activate();
