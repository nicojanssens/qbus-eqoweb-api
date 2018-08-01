// max delay in ms between two consecutive qbus calls
module.exports.MAX_POLLING_DELAY_MS = process.env.MAX_POLLING_DELAY_MS || 2000;
// timeout in milliseconds to abort a request
module.exports.HTTP_TIMEOUT_MS = process.env.HTTP_TIMEOUT_MS || 500;
