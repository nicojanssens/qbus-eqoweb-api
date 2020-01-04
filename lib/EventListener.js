const { diff } = require('deep-diff');
const events = require('events');
const Q = require('q');
const connectP = require('./Connect');
const getGroupsP = require('./GetGroups');
const { MAX_POLLING_DELAY_MS, HTTP_TIMEOUT_MS } = require('./Constants');

const ITEMS_KEY = 'Itms';
const VAL_KEY = 'Val';
const NAME_KEY = 'Nme';
const ICO_KEY = 'Ico';

const TOO_MANY_DEVICES_CONNECTED_ERROR = 'Too many devices connected to the controller.';
const TOO_MANY_DEVICES_CONNECTED_DELAY = 5000;
const HTTP_TIMEOUT_EXCEEDED = `timeout of ${HTTP_TIMEOUT_MS}ms exceeded`;
const HTTP_TIMEOUT_DELAY = 1000;
const SYSTEM_MANAGER_STILL_CONNECTED = 'System manager is still connected.';
const SYSTEM_MANAGER_STILL_CONNECTED_DELAY = 10000;

class EventListener extends events.EventEmitter {
  constructor(args) {
    super();
    this.active = false;
    this.args = args;
  }

  activate() {
    console.log('Event listener activated');
    this.active = true;
    this.run();
  }

  deactivate() {
    console.log('Event listener deactivated');
    this.active = false;
  }

  onUpdate(update) {
    this.emit('update', update);
  }

  run() {
    if (!this.active) {
      return;
    }
    const startTime = Date.now();
    connectP(this.args)
      .then((sessionId) => {
        this.args.sessionId = sessionId;
        return getGroupsP(this.args);
      })
      .then((groups) => {
        if (this.previousGroups) {
          const diffs = diff(this.previousGroups, groups);
          if (diffs !== undefined) {
            diffs.forEach((change) => {
              // we're expecting properties only to be edited
              if (change.kind === 'E') {
                const { path } = change;
                const groupIndex = path[0];
                const itemsKey = path[1];
                const itemsIndex = path[2];
                const valKey = path[3];
                // const valIndex = path[4];
                if (itemsKey === ITEMS_KEY && valKey === VAL_KEY) {
                  const item = groups[groupIndex][itemsKey][itemsIndex];
                  const update = {
                    name: item[NAME_KEY],
                    type: item[ICO_KEY],
                    oldVal: change.lhs,
                    newVal: change.rhs,
                  };
                  this.onUpdate(update);
                }
              }
            });
          }
        }
        this.previousGroups = groups;
        const endTime = Date.now();
        const delay = Math.max(MAX_POLLING_DELAY_MS - (endTime - startTime), 0);
        return Q.delay(delay);
      })
      .catch((error) => {
        // emit error event
        this.emit('error', error.message);
        // analyse error
        switch (error.message) {
          case TOO_MANY_DEVICES_CONNECTED_ERROR:
            // retry after delay
            return Q.delay(TOO_MANY_DEVICES_CONNECTED_DELAY);
          case HTTP_TIMEOUT_EXCEEDED:
            // retry after delay
            return Q.delay(HTTP_TIMEOUT_DELAY);
          case SYSTEM_MANAGER_STILL_CONNECTED:
            // retry after delay
            return Q.delay(SYSTEM_MANAGER_STILL_CONNECTED_DELAY);
          default:
            // break loop
            this.deactivate();
            return Q(undefined);
        }
      })
      .finally(() => {
        this.run();
      });
  }
}

module.exports = EventListener;
