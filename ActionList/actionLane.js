
function ActionLane() {
    this.id = 0;
    this.actions = [];
}

ActionLane.prototype.reset = function() {
    this.actions.forEach(function(action) {
        action.finished = false;
        action.succeeded = false;
        action.failed = false;
    }, this);
}

ActionLane.prototype.cancel = function() {
    this.actions.forEach(function(action) {
        action.cancel();
    }, this);
}

ActionLane.prototype.pause = function() {
    this.actions.forEach(function(action) {
        action.pause();
    }, this);
}

ActionLane.prototype.resume = function() {
    this.actions.forEach(function(action) {
        action.resume();
    }, this);
}

ActionLane.prototype.block = function() {
    this.actions.forEach(function(action) {
        action.block();
    }, this);
}

ActionLane.prototype.unblock = function() {
    actions.forEach(function(action) {
        action.unblock();
    }, this);
}

module.exports = ActionLane;