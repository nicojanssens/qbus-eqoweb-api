const codes = require('./Codes');

const checkIfErrorResponse = (data) => {
  if (data.Type === codes.command.ERROR) {
    const errorMessage = codes.errorMessage[data.Value.Error];
    throw new Error(errorMessage);
  }
};

const checkIfMandatoryArgsAreDefined = (args) => {
  if (!args.address) {
    throw new Error('address is undefined');
  }
  if (!args.sessionId) {
    throw new Error('sessioId is undefined');
  }
};

module.exports.checkIfErrorResponse = checkIfErrorResponse;
module.exports.checkIfMandatoryArgsAreDefined = checkIfMandatoryArgsAreDefined;
