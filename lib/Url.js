const url = require('url');

const getEQOwebUrl = (address, optionalPort) => {
  if (!address) {
    throw new Error('address is undefined');
  }
  const port = (optionalPort === undefined) ? 8444 : optionalPort;
  return url.format({
    protocol: 'http',
    hostname: address,
    port,
    pathname: '/default.aspx',
    query: `r=${Math.random()}`,
  });
};

module.exports = getEQOwebUrl;
