const createHttpHeaders = (sessionId) => {
  if (sessionId === undefined) {
    throw new Error('sessionId must be defined');
  }
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Cookie: `i=${sessionId}`,
    'User-Agent': 'QBusJS/1.0',
  };
  return headers;
};

module.exports = createHttpHeaders;
