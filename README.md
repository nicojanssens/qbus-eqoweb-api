# QBus EQOweb API

## Summary

Small library to interact with the EQOweb API of the QBus CTD 01E, CTD 02E or CTD 03E controller. More information about this home automation system is available on the [QBus home page](http://www.qbus.be/en/home).

## Features
Supports basic interactions with EQOweb API,
  1. to establish a connection with the QBus controller,
  1. to retrieving an overview of all channels,
  1. to get the current status of a specific channel, and to
  1. update the status of a specific channel

All these operations return promises, so you can easily chain them.

## Install
```
npm install qbus-eqoweb-api
```

## Usage
```js
const connectP = require('qbus-eqoweb-api').connectP;
const getGroupsP = require('qbus-eqoweb-api').getGroupsP;
const getChannelStatusP = require('qbus-eqoweb-api').getChannelStatusP;
const updateChannelStatusP = require('qbus-eqoweb-api').updateChannelStatusP;

const testArgs = {
  username: EQOWEB_USERNAME,
  password: EQOWEB_PASSWORD,
  address: EQOWEB_ADDRESS,
  port: EQOWEB_PORT,
};

const channelName = CHANNEL_NAME;

const findChannelId = (groups, name) => {
  let channelId;
  groups.forEach((group) => {
    const channelItem = group.Itms.find(item => (
      item.Nme === name
    ));
    if (channelItem) {
      channelId = channelItem.Chnl;
    }
  });
  return channelId;
};

const run = () => {
  let sessionId;
  let channelId;

  // init new session
  connectP(testArgs)
    .then((newSessionId) => {
      console.log(`created session ${newSessionId}`);
      sessionId = newSessionId;
      const args = Object.assign({}, testArgs, { sessionId });
      // retrieving an overview of all channels
      return getGroupsP(args);
    })
    .then((groups) => {
      console.log(`received groups ${JSON.stringify(groups)}`);
      channelId = findChannelId(groups, channelName);
      if (!channelId) {
        throw new Error(`no channel id matching with ${channelName}`);
      }
      const args = Object.assign({}, testArgs, { sessionId, channelId });
      // get the current status of a specific channel
      return getChannelStatusP(args);
    })
    .then((channelStatus) => {
      console.log(`received channel status ${JSON.stringify(channelStatus)}`);
      const args = Object.assign({}, testArgs, { sessionId, channelId, newStatus: [255] });
      // update the status of a specific channel
      return updateChannelStatusP(args);
    })
    .then((channelStatus) => {
      console.log(`received channel status ${JSON.stringify(channelStatus)}`);
    })
    .catch((error) => {
      console.log(error);
    });
};

run();
```

## API

### `connectP(args)`
Init a new session on the QBus controller, returning a promise that resolves once this session is created. The `args` object must contain the following attributes:
```
{
  username: String, // eqoweb controller username
  password: String, // eqoweb controller pwd
  address: String, // eqoweb controller address -- e.g. 192.168.1.1 ,
  port: Number, // optional port nb, default is 8444
  sessionId: String, // optional sessionId, required to refresh an existing session
}
```
Return value: the id of this new session.

### `getGroupsP(args)`
Creates a promise that returns an overview of all QBus groups. The `args` object must contain the following attributes:
```
{
  username: String, // eqoweb controller username
  password: String, // eqoweb controller pwd
  address: String, // eqoweb controller address -- e.g. 192.168.1.1 ,
  port: Number, // optional port nb, default is 8444
  sessionId: String, // mandatory sessionId
}
```
Return value:
```
[  
  {  
    "Nme": "kitchen",
    "Itms": [  
      {  
        "Chnl": 1,
        "Nme": "light",
        "Ico": 0,
        "Val": [  
          0
        ]
      }
    ]
  },
  ...
]
```

### `getChannelStatusP(args)`
Creates a promise returns the current status of a specific channel. The `args` object must contain the following attributes:
```
{
  username: String, // eqoweb controller username
  password: String, // eqoweb controller pwd
  address: String, // eqoweb controller address -- e.g. 192.168.1.1 ,
  port: Number, // optional port nb, default is 8444
  sessionId: String, // mandatory sessionId
  channelId: Number, // id of the channel to query
}
```
Return value:
```
{
  "Chnl": 1,
  "Val": [0]
}
```

### `updateChannelStatusP(args)`
Creates a promise that resolves once the status of a specific channel is updated. The `args` object must contain the following attributes:
```
{
  username: String, // eqoweb controller username
  password: String, // eqoweb controller pwd
  address: String, // eqoweb controller address -- e.g. 192.168.1.1 ,
  port: Number, // optional port nb, default is 8444,
  channelId: Number, // id of the channel to update
  newStatus: Array, // depends on channel type, e.g. to switch on a channel use [255]
}
```
Return value:
```
{
  "Chnl": 1,
  "Val": [255]
}
```

### Configuration ###

You can define the max qbus polling delay via env variable ```MAX_POLLING_DELAY_MS``` (default = 2000ms) and the timeout to abort a qbus request using env variable ```HTTP_TIMEOUT_MS``` (default = 500ms).

## Examples
See examples directory. First copy over the `.env.example` configuration and adapt it. Then run the scripts to test communication with your QBus controller.
