const command = {};
const channelType = {};
const errorType = {};
const errorMessage = {};

command.ERROR = 0;
command.LOGIN = 1;
command.LOGIN_RESPONSE = 2;
command.GET_GROUPS = 10;
command.GET_GROUPS_RESPONSE = 11;
command.SET_STATUS = 12;
command.SET_STATUS_RESPONSE = 13;
command.GET_STATUS = 14;
command.GET_STATUS_RESPONSE = 15;

channelType.TOGGLE = 0;
channelType.DIMMER = 1;
channelType.SET_TEMP = 2;
channelType.PROG_TEMP = 3;
channelType.SHUTTERS = 4;
channelType.AUDIO = 5;
channelType.SCENES = 7;

errorType['0'] = 'PARSE_ERROR';
errorType['1'] = 'ARGUMENT_ERROR';
errorType['2'] = 'CONNECTION_ERROR';
errorType['3'] = 'LOGIN_ERRORe';
errorType['4'] = 'UNDEFINED_ERROR';

errorMessage['1'] = 'The controller is busy.';
errorMessage['2'] = 'Your session timed out.';
errorMessage['3'] = 'Too many devices connected to the controller.';
errorMessage['4'] = 'The controller was unable to execute your command.';
errorMessage['5'] = 'Your session could not be started.';
errorMessage['6'] = 'The command is unknown.';
errorMessage['7'] = 'No EQOweb configuration found.';
errorMessage['8'] = 'System manager is still connected.';
errorMessage['255'] = 'Undefined controller error.';

module.exports.command = command;
module.exports.channelType = channelType;
module.exports.errorType = errorType;
module.exports.errorMessage = errorMessage;
