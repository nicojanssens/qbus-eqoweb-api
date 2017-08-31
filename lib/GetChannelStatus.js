const axios = require('axios');
const codes = require('./Codes');
const headers = require('./Headers');
const url = require('./Url');
const utils = require('./Utils');

const getChannelStatusP = (args) => {
  if (!args.channelId) {
    throw new Error('ChannelId undefined');
  }
  utils.checkIfMandatoryArgsAreDefined(args);
  const request = {
    Type: codes.command.GET_STATUS,
    Value: {
      Chnl: args.channelId,
    },
  };
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
    if (data.Type === codes.command.GET_STATUS_RESPONSE) {
      return data.Value; // return groups
    }
    throw new Error('All dazed and confused, receiving unknown message');
  });
};

module.exports = getChannelStatusP;
