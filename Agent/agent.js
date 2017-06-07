var AgentBrain = require('./agentBrain.js')

function Agent(bot, name, manager){
    console.log(name);
    this.name = name;
    this.bot = bot;
    this.brain = new AgentBrain(this);
    this.manager = manager; //The manager that managing this agent
    this.moving = false;
    this.start();
}

Agent.prototype.update = function(){
    this.bot.setControlState('sprint', this.moving);
    this.brain.update();
};

Agent.prototype.start = function()
{
    this.brain.start();
};

Agent.prototype.stop = function()
{
    this.brain.stop();
};

Agent.prototype.pause = function()
{
    this.brain.pause();
};

Agent.prototype.resume = function()
{
    this.brain.resume();
};

var Direction = {
    FORWARD: 'forward',
    BACKWARD: 'back',
    LEFT: 'left',
    RIGHT: 'right',
};

// There is a fancier way to do directions but lets not get too complicated yet

/**
 * Reset agent to origin position and movement
 */
Agent.prototype.origin = function() {
    this.look(0, 0);
    this.stopMove();
};

Agent.prototype.startSprint = function() {
    this.bot.setControlState('sprint', true);
};

Agent.prototype.stopStrint = function() {
    this.bot.setControlState('sprint', false);
}

Agent.prototype.stopMove = function() {
    this.bot.clearControlStates();
    this.bot.clearControlStates();
};


Agent.prototype.dig = function(cb) {

    if(this.brain.wood != null) {
 //       console.log("the wood:" + this.brain.wood);
        if (this.bot.targetDigBlock == null) {
            if (this.bot.canDigBlock(this.brain.wood)) {
 //               console.log("the wood2:" + this.brain.wood);
                this.bot.dig(this.brain.wood, cb);
            }
        }
    }

}

Agent.prototype.look = function(yaw, pitch) {
    this.bot.look(yaw, pitch);
};

Agent.prototype.lookAtPosition = function(position) {
    this.bot.lookAt(position);
};

Agent.prototype.startDiagonalMove = function(verticalDirection, horizontalDirection){
    this.toggleDirection(verticalDirection).start();
    this.toggleDirection(horizontalDirection).start();
};

Agent.prototype.stopDiagonalMove = function(verticalDirection, horizontalDirection)
{
    this.toggleDirection(verticalDirection).stop();
    this.toggleDirection(horizontalDirection).stop();
}

Agent.prototype.startMove = function(direction) {
    this.bot.setControlState('forward', true);
};

Agent.prototype.stopMove = function(direction) {
    this.bot.setControlState("forward", false);
}

Agent.prototype.ready = function()
{

    // console.log(this.bot.entity)
    //     console.log("here")
    if(this.bot.entity)
    {
        if(this.bot.entity.onGround)
        {
            return true;
        }
    }
    return false;
}

/**
 * Send action list to brain
 */
Agent.prototype.setActionList = function (actionList) {
    this.brain.setActionList(actionList);
}

module.exports = Agent;
