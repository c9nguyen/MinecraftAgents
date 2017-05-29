var Daemon = require('./daemon.js')

//Implement Look random
//Implement Scan Direction Up down left Right

// Daemons are the simplest tasks that the agent can perform. These Daemons are constructed together to create complex behaviours.

function TestDaemon() {
    Daemon.call(this)
    this.random = 0;
}

TestDaemon.prototype = Object.create(Daemon.prototype);
TestDaemon.prototype.constructor = TestDaemon;

TestDaemon.prototype.update = function (delta) {
    console.log("Test")
    random += Math.random();
    this.succeed();
}

function Wait(duration) {
    Daemon.call(this)
    // this.duration = duration || 100; // in milliseconds
    this.duration = duration < 0 ? 0 : duration;
    this.startTime = 0;
    this.once('started', function () { this.startTime = Date.now(); })
}

Wait.prototype = Object.create(Daemon.prototype);
Wait.prototype.constructor = Wait;

// Wait.prototype.OnStarted = function() {
//     this.startTime = Date.now();
// }

Wait.prototype.update = function (delta) {
    if (Date.now() - this.startTime > this.duration) {
        console.log("Wait Done");
        this.succeed();
    }
}


function StartMoveForward() {
    Daemon.call(this);
}

StartMoveForward.prototype = Object.create(Daemon.prototype);
StartMoveForward.prototype.constructor = StartMoveForward;

StartMoveForward.prototype.update = function (delta, agent) {
    agent.startMove('forward');
    // console.log("Start Move");
    this.succeed();
}

function StopMoveForward() {
    Daemon.call(this)
}

StopMoveForward.prototype = Object.create(Daemon.prototype);
StopMoveForward.prototype.constructor = StopMoveForward;

StopMoveForward.prototype.update = function (delta, agent) {
    // console.log("Stop Move");
    agent.stopMove('forward');
    this.succeed();
}


function StartMoveBackward() {
    Daemon.call(this)
}

StartMoveBackward.prototype = Object.create(Daemon.prototype);
StartMoveBackward.prototype.constructor = StartMoveBackward;

StartMoveBackward.prototype.update = function (delta, agent) {
    console.log("start back");
    agent.startMove('back');
    this.succeed();
}

function StopMoveBackward() {
    Daemon.call(this)
}

StopMoveBackward.prototype = Object.create(Daemon.prototype);
StopMoveBackward.prototype.constructor = StopMoveBackward;

StopMoveBackward.prototype.update = function (delta, agent) {
    // console.log("stop back");
    agent.stopMove('back');
    this.succeed();
}

function BreakBlock() {
    Daemon.call(this)
    this.tblock = null;
    this.test = function() {
            this.tblock = null;
            this.succeed();
        }
}

BreakBlock.prototype = Object.create(Daemon.prototype);
BreakBlock.prototype.constructor = BreakBlock;

BreakBlock.prototype.update = function (delta, agent) {
    // agent.bot.clearControlStates();
    if (this.tblock == null) {
        this.tblock = agent.brain.wood;
        agent.dig(this.test.bind(this));
    }
}

function RotateHeadRandom() {
    Daemon.call(this)
}

RotateHeadRandom.prototype = Object.create(Daemon.prototype);
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
    this.succeed();
}

function Look() {
    Daemon.call(this)
}

Look.prototype = Object.create(Daemon.prototype);
Look.prototype.constructor = Look;

Look.prototype.update = function (delta, agent) {
    agent.brain.look();
    // console.log("brain look")
    this.succeed();
}
function LookRandom() {
    Daemon.call(this)
    this.random = 0;
}

LookRandom.prototype = Object.create(Daemon.prototype);
LookRandom.prototype.constructor = LookRandom;

LookRandom.prototype.update = function (delta, agent) {
    let yaw = getRandomFloat(-Math.PI / 2, Math.PI / 2);
    let pitch = getRandomFloat(-Math.PI / 2, Math.PI / 2);
    agent.look(yaw, pitch);
    // console.log("move head")
    this.succeed();
}
//
function ScanDirection() {
    Daemon.call(this)
    this.random = 0;
}

ScanDirection.prototype = Object.create(Daemon.prototype);
ScanDirection.prototype.constructor = ScanDirection;

ScanDirection.prototype.update = function (delta, agent) {
    
    this.succeed();
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// function GetWood() {
//     Daemon.call(this);
// }

// GetWood.prototype = Object.create(Daemon.prototype);
// GetWood.prototype.constructor = GetWood;

// GetWood.prototype.update = function (delta, agent) {
//     // if
//     // if (agent.brain.wood) {
//     //     this.succeed();
//     // }
//     // agent.lookRandom();
//     // agent.see();
// }

// function FindWood() {
//     Daemon.call(this);
// }

// FindWood.prototype = Object.create(Daemon.prototype);
// FindWood.prototype.constructor = FindWood;

// FindWood.prototype.update = function (delta, agent) {
//     if (agent.brain.wood) {
//         this.parent.pushBack(new MoveToWood());
//         this.succeed();
//     }
//     agent.lookRandom();
//     agent.brain.look();
// }

// function MoveToWood() {
//     Daemon.call(this);
// }

// MoveToWood.prototype = Object.create(Daemon.prototype);
// MoveToWood.prototype.constructor = MoveToWood;

// MoveToWood.prototype.update = function (delta, agent) {
//     if (agent.brain.wood) {
//         agent.startMove('forward');
//         agent.brain.look();
//     } else {
//         agent.stopMove('forward');
//         this.parent.pushBack(new ChopWood());
//         this.succeed();
//     }
// }

// function ChopWood() {
//     Daemon.call(this);
// }

// ChopWood.prototype = Object.create(Daemon.prototype);
// ChopWood.prototype.constructor = ChopWood;

// ChopWood.prototype.update = function (delta, agent) {
//     if (agent.brain.wood) {
//         agent.use();
//         agent.brain.look();
//     } else {
//         this.parent.pushBack(new FindWood())
//         this.succeed();
//     }
// }

module.exports = {
    // GetWood,
    RotateHeadRandom,
    Look,
    Wait,
    StartMoveForward,
    StopMoveForward,
    StartMoveBackward,
    StopMoveBackward,
    LookRandom,
    BreakBlock
}
// module.exports.Wait = Wait;
// module.exports.StartMoveForward = StartMoveForward;
// module.exports.StopMoveForward = StopMoveForward;
// module.exports.StartMoveBackward = StartMoveBackward;
// module.exports.StopMoveBackward = StopMoveBackward;