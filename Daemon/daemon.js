// http://becausejavascript.com/node-js-event-emitters/
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
// http://allenchou.net/2012/07/action-lists-they-are-cooler-than-commands/
// https://gamedevelopment.tutsplus.com/tutorials/the-action-list-data-structure-good-for-ui-ai-animations-and-more--gamedev-9264
var EventEmitter = require('events').EventEmitter;

// A blocked Daemon will not execute the next action in its respective collection.
// A paused Daemon will not be processed until not paused.
// The started flag is set right before the first update is called on a Daemon
// The finish flag is set after an action succeeds or fails.
// The succeeded flag is set after an action succeeds.
// The failed flag is set after an action fails.
function Daemon(succeeds, fails) {
    EventEmitter.call(this);

    succeeds = succeeds || this.succeeds;
    fails = fails || this.fails;

    this.started = false;
    this.finished = false;

    this.succeeded = false;
    this.failed = false;

    this.paused = false;
    // Prevents daemons executing after it in a collection.
    this.blocking = false;

    this.laneID = 0;
}

Daemon.prototype = Object.create(EventEmitter.prototype);
Daemon.prototype.constructor = Daemon;

Daemon.prototype.update = function(delta, agent) {

};

Daemon.prototype.block = function() {
    this.blocking = true;
}

Daemon.prototype.unblock = function() {
    this.blocking = false;
}

Daemon.prototype.fails = function(agent) {
    return false;
}

Daemon.prototype.succeeds = function (agent) {
    return false;
}

// Events

Daemon.prototype.succeed = function () {
    this.succeeded = true;
    this.emit('success');
}

Daemon.prototype.failure = function () {
    this.failed = true;
    this.emit('failure');
}

Daemon.prototype.start = function() {
    this.emit('started');
    this.started = true;
};

Daemon.prototype.complete = function () {
    this.finished = true;
    this.emit('completed');
    this.emit('finished');
};

Daemon.prototype.pause = function() {
    this.paused = true;
    this.emit('paused');
};

Daemon.prototype.resume = function() {
    this.paused = false;
    this.emit('resumed');
};

Daemon.prototype.cancel = function() {
    this.finished = true;
    this.emit('cancelled');
    this.emit('finished');
};

module.exports = Daemon;
