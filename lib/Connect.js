const axios = require('axios');
const codes = require('./Codes');
const headers = require('./Headers');
const url = require('./Url');
const utils = require('./Utils');

const connectP = (args) => {
  const argsWithSessionId = (args.sessionId === undefined) ? Object.assign({}, args, { sessionId: '4855FE45' }) : args;
  if (!argsWithSessionId.username) {
    throw new Error('username is undefined');
  }
  if (!argsWithSessionId.password) {
    throw new Error('password is undefined');
  }
  utils.checkIfMandatoryArgsAreDefined(argsWithSessionId);
  const request = {
    Type: codes.command.LOGIN,
    Value: {
      Usr: argsWithSessionId.username,
      Psw: argsWithSessionId.password,
    },
  };
  const requestData = encodeURIComponent(JSON.stringify(request));
  const requestConfig = {
    method: 'post',
    url: url(argsWithSessionId.address, argsWithSessionId.port),
    headers: headers(argsWithSessionId.sessionId),
    data: `strJSON=${requestData}`,
  };
  return axios(requestConfig).then((response) => {
    const data = response.data;
    utils.checkIfErrorResponse(data);
    if (data.Type === codes.command.LOGIN_RESPONSE && data.Value.rsp === false) {
      throw new Error('Unable to establish connection, please check your username and password');
    } else if (data.Type === codes.command.LOGIN_RESPONSE && data.Value.rsp === true) {
      return data.Value.id; // return final sessionId
    }
    throw new Error('All dazed and confused, receiving unknown message');
  });
};

module.exports = connectP;
