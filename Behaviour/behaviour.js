// var Action = require('./action.js')
var ActionList = require('../ActionList/actionList.js')
var ActionLibrary = require('../ActionList/actionLibrary.js')
// TODO: have the ActionList listen to an action completed to call next action.
// Use an init method to 
// Would I need a delta???

// A Behaviour is an action list which the agent determines its completion. The Behaviour an agent emulates is decided by the agent's brain.
// This is meerly an abstraction place holder. We might want a higher api between actual Behaviours and action lists.
function Behaviour(actionNameList = []) {
    ActionList.call(this);
    this.succeeded = false;
    this.actionNameList = actionNameList;
    this.loadActionList();
}



Behaviour.prototype = Object.create(ActionList.prototype);
Behaviour.prototype.constructor = Behaviour;

/**
 * Load all action list into action list queue from action list name
 */
Behaviour.prototype.loadActionList = function() {
    var self = this;
    this.actionNameList.map(function(name) {
        self.pushBack(ActionLibrary.getAction(name));
    });
}

module.exports = Behaviour;

