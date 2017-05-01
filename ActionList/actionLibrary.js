var Action = require('./action.js')

//Implement Look random
//Implement Scan Direction Up down left Right

// Actions are the simplest tasks that the agent can perform. These actions are constructed together to create complex behaviours.

function TestAction() {
    Action.call(this)
    this.random = 0;
}

TestAction.prototype = Object.create(Action.prototype);
TestAction.prototype.constructor = TestAction;

TestAction.prototype.update = function (delta) {
    console.log("Test")
    random += Math.random();
    this.complete();
}

function Origin() {
    Action.call(this)
    this.random = 0;
}

Origin.prototype = Object.create(Action.prototype);
Origin.prototype.constructor = Origin;

Origin.prototype.update = function (delta, agent) {
    agent.look(0, 0);
    agent.stopMove();
    this.complete();
}

function Wait(duration) {
    Action.call(this)
    // this.duration = duration || 100; // in milliseconds
    this.duration = duration < 0 ? 0 : duration;
    this.startTime = 0;
    this.once('started', function () { this.startTime = Date.now(); })
}


Wait.prototype = Object.create(Action.prototype);
Wait.prototype.constructor = Wait;

// Wait.prototype.OnStarted = function() {
//     this.startTime = Date.now();
// }

Wait.prototype.update = function (delta) {
    if (Date.now() - this.startTime > this.duration) {
        console.log("Wait Done");
        this.complete();
    }
}


function StartMoveForward() {
    Action.call(this);
}

StartMoveForward.prototype = Object.create(Action.prototype);
StartMoveForward.prototype.constructor = StartMoveForward;

StartMoveForward.prototype.update = function (delta, agent) {
    agent.startMove('forward');
    console.log("Start Move");
    this.complete();
}

// function MoveForwardABit() {
//     Action.call(this);
//     this.amount = 5;
// }

// MoveForwardABit.prototype = Object.create(Action.prototype);
// MoveForwardABit.prototype.constructor = StartMoveForward;

// MoveForwardABit.prototype.update = function (delta, agent) {
//     if ()
//     agent.startMove('forward');
//     console.log("Start Move");
//     this.complete();
// }

function StopMoveForward() {
    Action.call(this)
}

StopMoveForward.prototype = Object.create(Action.prototype);
StopMoveForward.prototype.constructor = StopMoveForward;

StopMoveForward.prototype.update = function (delta, agent) {
    console.log("Stop Move");
    agent.stopMove('forward');
    this.complete();
}


function StartMoveBackward() {
    Action.call(this)
}

StartMoveBackward.prototype = Object.create(Action.prototype);
StartMoveBackward.prototype.constructor = StartMoveBackward;

StartMoveBackward.prototype.update = function (delta, agent) {
    console.log("start back");
    agent.startMove('back');
    this.complete();
}

function StopMoveBackward() {
    Action.call(this)
}

StopMoveBackward.prototype = Object.create(Action.prototype);
StopMoveBackward.prototype.constructor = StopMoveBackward;

StopMoveBackward.prototype.update = function (delta, agent) {
    console.log("stop back");
    agent.stopMove('back');
    this.complete();
}

function BreakBlock() {
    Action.call(this)
}

BreakBlock.prototype = Object.create(Action.prototype);
BreakBlock.prototype.constructor = BreakBlock;

BreakBlock.prototype.update = function (delta, agent) {
    // agent.bot.clearControlStates();
    agent.dig();
    this.complete();
}

function RotateHeadRandom() {
    Action.call(this)
}

RotateHeadRandom.prototype = Object.create(Action.prototype);
RotateHeadRandom.prototype.constructor = RotateHeadRandom;

RotateHeadRandom.prototype.update = function (delta, agent) {
    var entity = agent.bot.entity;
    var yaw = entity.yaw;
    var pitch = entity.pitch;
    var increment = Math.floor(Math.random() * 10) + 5;
    if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
            yaw += increment;
        } else {
            yaw -= increment;
        }
    } else {
        if (Math.random() > 0.5) {
            pitch += increment;
        } else {
            pitch -= increment;
        }
    }
    agent.bot.look(yaw, pitch)
    this.complete();
}

function Look() {
    Action.call(this)
}

Look.prototype = Object.create(Action.prototype);
Look.prototype.constructor = Look;

Look.prototype.update = function (delta, agent) {
    agent.brain.look();
 //   console.log("brain look")
    this.complete();
}

function LookRandom() {
    Action.call(this)
    this.random = 0;
}

LookRandom.prototype = Object.create(Action.prototype);
LookRandom.prototype.constructor = LookRandom;

LookRandom.prototype.update = function (delta, agent) {
    let yaw = getRandomFloat(-Math.PI / 2, Math.PI / 2);
    let pitch = getRandomFloat(-Math.PI / 2, Math.PI / 2);
    agent.look(yaw, pitch);
  //  console.log("move head")
    this.complete();
}

/* ================================================================================= */

/**
 * Turn head to the right
 */
function TurnHeadRight() {
    Action.call(this)
    this.random = 0;
}

TurnHeadRight.prototype = Object.create(Action.prototype);
TurnHeadRight.prototype.constructor = TurnHeadRight;



TurnHeadRight.prototype.update = function (delta, agent) {
//    let pitch = getRandomFloat(-Math.PI / 2, Math.PI / 2);
    var originYaw = agent.bot.entity.yaw;
    agent.look(originYaw + Math.PI / 16, 0);
  //  console.log("turn right")
    this.complete();
}

/* ================================================================================= */

/**
 * Turn head to the left
 */
function TurnHeadLeft() {
    Action.call(this)
    this.random = 0;
}

TurnHeadLeft.prototype = Object.create(Action.prototype);
TurnHeadLeft.prototype.constructor = TurnHeadLeft;



TurnHeadLeft.prototype.update = function (delta, agent) {
//    let pitch = getRandomFloat(-Math.PI / 2, Math.PI / 2);
    var originYaw = agent.bot.entity.yaw;
    agent.look(originYaw - Math.PI / 16, 0);
  //  console.log("turn left")
    this.complete();
}

/* ================================================================================= */

/**
 * Turn head to the left
 */
function HeadUp() {
    Action.call(this)
    this.random = 0;
}

HeadUp.prototype = Object.create(Action.prototype);
HeadUp.prototype.constructor = HeadUp;



HeadUp.prototype.update = function (delta, agent) {
//    let pitch = getRandomFloat(-Math.PI / 2, Math.PI / 2);
    var originPith = agent.bot.entity.pitch;
    agent.look(0, originPith + Math.PI / 16);
  //  console.log("turn left")
    this.complete();
}

/* ================================================================================= */

/**
 * Turn head to the left
 */
function HeadDown() {
    Action.call(this)
    this.random = 0;
}

HeadDown.prototype = Object.create(Action.prototype);
HeadDown.prototype.constructor = HeadDown;



HeadDown.prototype.update = function (delta, agent) {
//    let pitch = getRandomFloat(-Math.PI / 2, Math.PI / 2);
    var originPith = agent.bot.entity.pitch;
    agent.look(0, originPith - Math.PI / 16);
  //  console.log("turn left")
    this.complete();
}

/* ================================================================================= */
//
function ScanDirection() {
    Action.call(this)
    this.random = 0;
}

ScanDirection.prototype = Object.create(Action.prototype);
ScanDirection.prototype.constructor = ScanDirection;

ScanDirection.prototype.update = function (delta, agent) {
    
    this.complete();
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// function GetWood() {
//     Action.call(this);
// }

// GetWood.prototype = Object.create(Action.prototype);
// GetWood.prototype.constructor = GetWood;

// GetWood.prototype.update = function (delta, agent) {
//     // if
//     // if (agent.brain.wood) {
//     //     this.complete();
//     // }
//     // agent.lookRandom();
//     // agent.see();
// }

// function FindWood() {
//     Action.call(this);
// }

// FindWood.prototype = Object.create(Action.prototype);
// FindWood.prototype.constructor = FindWood;

// FindWood.prototype.update = function (delta, agent) {
//     if (agent.brain.wood) {
//         this.parent.pushBack(new MoveToWood());
//         this.complete();
//     }
//     agent.lookRandom();
//     agent.brain.look();
// }

// function MoveToWood() {
//     Action.call(this);
// }

// MoveToWood.prototype = Object.create(Action.prototype);
// MoveToWood.prototype.constructor = MoveToWood;

// MoveToWood.prototype.update = function (delta, agent) {
//     if (agent.brain.wood) {
//         agent.startMove('forward');
//         agent.brain.look();
//     } else {
//         agent.stopMove('forward');
//         this.parent.pushBack(new ChopWood());
//         this.complete();
//     }
// }

// function ChopWood() {
//     Action.call(this);
// }

// ChopWood.prototype = Object.create(Action.prototype);
// ChopWood.prototype.constructor = ChopWood;

// ChopWood.prototype.update = function (delta, agent) {
//     if (agent.brain.wood) {
//         agent.use();
//         agent.brain.look();
//     } else {
//         this.parent.pushBack(new FindWood())
//         this.complete();
//     }
// }
function GetActionList() {
    var actionList = [
        "RotateHeadRandom",
        "Look",
        // "Wait",
        // "StartMoveForward",
        // "StopMoveForward",
        // "StartMoveBackward",
        // "StopMoveBackward",
        "LookRandom",
        //"BreakBlock",
        "TurnHeadRight",
        "TurnHeadLeft",
        "HeadUp",
        "HeadDown"
    ];

    return actionList;
}

function GetAction(actionName) {
    var action;
    switch (actionName) {
        case "RotateHeadRandom":
            action = new RotateHeadRandom();
            break;
        case "Look":
            action = new Look();
            break;
        case "Wait":
            action = new Wait();
            break;
        case "StartMoveForward":
            action = new StartMoveForward();
            break;
        case "StopMoveForward":
            action = new StopMoveForward();
            break;
        case "StartMoveBackward":
            action = new StartMoveBackward();
            break;
        case "StopMoveBackward":
            action = new StopMoveBackward();
            break;
        case "LookRandom":
            action = new LookRandom();
            break;
        case "BreakBlock":
            action = new BreakBlock();
            break;
        case "TurnHeadRight":
            action = new TurnHeadRight();
            break;
        case "TurnHeadLeft":
            action = new TurnHeadLeft();
            break;
        case "HeadUp":
            action = new HeadUp();
            break;
        case "HeadDown":
            action = new HeadDown();
            break;
    }

    return action;
}


module.exports = {
    // GetWood,
    GetActionList,
    GetAction,
    Origin,
    RotateHeadRandom,
    Look,
    Wait,
    StartMoveForward,
    StopMoveForward,
    StartMoveBackward,
    StopMoveBackward,
    LookRandom,
    BreakBlock,
    // TurnHeadRight,
    // TurnHeadLeft,
    // HeadUp,
    // HeadDown,
}
// module.exports.Wait = Wait;
// module.exports.StartMoveForward = StartMoveForward;
// module.exports.StopMoveForward = StopMoveForward;
// module.exports.StartMoveBackward = StartMoveBackward;
// module.exports.StopMoveBackward = StopMoveBackward;