const connectP = require('./Connect');
const diff = require('deep-diff').diff;
const events = require('events');
const getGroupsP = require('./GetGroups');
const Q = require('q');

const timeout = 2;

const ITEMS_KEY = 'Itms';
const VAL_KEY = 'Val';
const NAME_KEY = 'Nme';
const ICO_KEY = 'Ico';

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

  onError(error) {
    if (this.listeners('error').length > 0) {
      this.emit('error', error);
      return;
    }
    throw new Error(error);
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
      }).then((groups) => {
        // console.log(groups);
        // console.log(JSON.stringify(groups));
        if (this.previousGroups) {
          const diffs = diff(this.previousGroups, groups);
          if (diffs !== undefined) {
            diffs.forEach((change) => {
              // we're expecting properties only to be edited
              if (change.kind === 'E') {
                const path = change.path;
                const groupIndex = path[0];
                const itemsKey = path[1];
                const itemsIndex = path[2];
                const valKey = path[3];
                // const valIndex = path[4];
                if (itemsKey === ITEMS_KEY && valKey === VAL_KEY) {
                  const item = groups[groupIndex][itemsKey][itemsIndex];
                  const update = {
                    name: item[NAME_KEY].toLowerCase(),
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
        const delay = Math.max((timeout * 1000) - (endTime - startTime), 0);
        return Q.delay(delay);
      }).then(() => {
        this.run();
      })
      .catch((error) => {
        console.log(error);
        this.onError(error);
      });
  }
}

module.exports = EventListener;
