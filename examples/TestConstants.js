require('dotenv').config();

// verify if all required EQOWEB env variables are set
if (!process.env.EQOWEB_USERNAME) { throw new Error('EQOWEB_USERNAME is undefined'); }
if (!process.env.EQOWEB_PASSWORD) { throw new Error('EQOWEB_PASSWORD is undefined'); }
if (!process.env.EQOWEB_ADDRESS) { throw new Error('EQOWEB_ADDRESS is undefined'); }

// export EQOWEB env variables
module.exports.EQOWEB_USERNAME = process.env.EQOWEB_USERNAME;
module.exports.EQOWEB_PASSWORD = process.env.EQOWEB_PASSWORD;
module.exports.EQOWEB_ADDRESS = process.env.EQOWEB_ADDRESS;
module.exports.EQOWEB_PORT = process.env.EQOWEB_PORT;

// verify test variables
if (!process.env.TEST_CHANNEL_ID) { throw new Error('CHANNEL_ID is undefined'); }
if (!process.env.TEST_CHANNEL_NAME) { throw new Error('CHANNEL_NAME is undefined'); }

// export test variables
module.exports.TEST_CHANNEL_ID = process.env.TEST_CHANNEL_ID;
module.exports.TEST_CHANNEL_NAME = process.env.TEST_CHANNEL_NAME;
