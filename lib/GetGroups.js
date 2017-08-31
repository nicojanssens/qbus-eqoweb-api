const axios = require('axios');
const codes = require('./Codes');
const headers = require('./Headers');
const url = require('./Url');
const utils = require('./Utils');

const getGroupsP = (args) => {
  const request = {
    Type: codes.command.GET_GROUPS,
    Value: 'null',
  };
  utils.checkIfMandatoryArgsAreDefined(args);
  const requestData = encodeURIComponent(JSON.stringify(request));
  const requestConfig = {
    method: 'post',
    url: url(args.address, args.port),
    headers: headers(args.sessionId),
    data: `strJSON=${requestData}`,
  };
  return axios(requestConfig).then((response) => {
    const data = response.data;
    utils.checkIfErrorResponse(data);
    if (data.Type === codes.command.GET_GROUPS_RESPONSE) {
      return data.Value.Groups; // return groups
    }
    throw new Error('All dazed and confused, receiving unknown message');
  });
};

module.exports = getGroupsP;
