
// var States = {
//     CUTTINGWOOD = 0,
//     LOOKINGFORWOOD = 1,
// }

// Maybe use node event emitter?
// agentBrain.on('foundWood'), agent.on('selectedAction')
var ActionList = require('../ActionList/actionList.js')
var actionUtils = require('../ActionList/actionUtils.js')
var ActionLibrary = require('../ActionList/actionLibrary.js');
var learningBeharivourLibrary = require('../Behaviour/learningBeharivourLibrary.js');
var BehaviourLibrary = require('../Behaviour/behaviourLibrary.js');
var daemonUtils = require('../Daemon/daemonUtils');
var DaemonLibrary = require('../Daemon/daemonLibrary');

var Vec3 = require('vec3').Vec3;
// var Wait = require('../ActionList/actionLibrary.js').Wait;
// var StartMoveForward = require('../ActionList/actionLibrary.js').StartMoveForward;
// var StopMoveForward = require('../ActionList/actionLibrary.js').StopMoveForward;
// var StartMoveBackward = require('../ActionList/actionLibrary.js').StartMoveBackward;
// var StopMoveBackward = require('../ActionList/actionLibrary.js').StopMoveBackward;
function AgentBrain(agent) {
    // this.visualMemory = [];
    this.agent = agent;
    this.actionList = new ActionList();
    this.woodID = 17;
    this.wood = false;
    this.viewDistance = 30;
    // this.actionSequence = ROUTINE.States.LOOKINGFORWOOD;
    // this.actionCursor = 0;
}
AgentBrain.prototype.start = function () {
    var self = this;
    // var testWait = actionUtils.serial([new ActionLibrary.Wait(3000)]);

    // var findWood = actionUtils.parallel([new ActionLibrary.LookRandom(), new ActionLibrary.StartMoveForward()]);
    // var walkToWood = actionUtils.serial([new ActionLibrary.StartMoveForward()]);
    // var chopWood = actionUtils.serial([new ActionLibrary.BreakBlock()]);
    // var getWood = actionUtils.serial([findWood, walkToWood, chopWood]);

    // var testSequence = actionUtils.serial([new ActionLibrary.StartMoveForward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StopMoveForward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StartMoveBackward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StopMoveBackward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StartMoveForward(), new ActionLibrary.Wait(3000),
    // new ActionLibrary.StopMoveForward()]);


//    var testSequence = new learningBeharivourLibrary.GetWood(this.agent); // Objective / Testing Objective
//     var find = new learningBeharivourLibrary.FindWood();
//     find.pushBack(new ActionLibrary.LookRandom());
//     find.pushBack(new ActionLibrary.Look())
// //    find.pushBack(new ActionLibrary.StartMoveForward());
//     find.block();
//     find.on('completed', function() {
//         console.log(self.agent.name + ' Found wood!')
//     })
//     var walk = new learningBeharivourLibrary.WalkToWood();
//     walk.pushBack(new ActionLibrary.StartMoveForward());
//     walk.pushBack(new ActionLibrary.Look())
//     walk.block();
//         walk.on('completed', function() {
//         console.log(self.agent.name + ' Next to Wood!')
//     })
//     var chop = new learningBeharivourLibrary.ChopWood();
//     chop.pushBack(new ActionLibrary.BreakBlock());
//     chop.block();
//     chop.on('completed', function() {
//         console.log(self.agent.name + ' chopped')
//     })
//     testSequence.pushBack(find); // Step 1
    // testSequence.pushBack(walk); // Step 2
    // testSequence.pushBack(chop); // Step 3
 //   this.actionList = testSequence;

    // var testSequence = new BehaviourLibrary.GetWood(); // Objective / Testing Objective
    // var find = new BehaviourLibrary.FindWood();
    // find.pushBack(new ActionLibrary.LookRandom());
    // find.pushBack(new ActionLibrary.Look())
    // find.pushBack(new ActionLibrary.StartMoveForward());
    // find.block();
    // find.on('completed', function() {
    //     console.log('Found wood!')
    // })
    // var walk = new BehaviourLibrary.WalkToWood();
    // walk.pushBack(new ActionLibrary.StartMoveForward());
    // walk.pushBack(new ActionLibrary.Look())
    // walk.block();
    //     walk.on('completed', function() {
    //     console.log('Next to Wood!')
    // })
    // var chop = new BehaviourLibrary.ChopWood();
    // chop.pushBack(new ActionLibrary.BreakBlock());
    // chop.block();
    // chop.on('completed', function() {
    //     console.log('chopped')
    // })
    // testSequence.pushBack(find); // Step 1
    // testSequence.pushBack(walk); // Step 2
    // testSequence.pushBack(chop); // Step 3
    // this.actionList = testSequence;
    var find = daemonUtils.serial([new DaemonLibrary.LookRandom(), new DaemonLibrary.Look(), new DaemonLibrary.StartMoveForward()])
    find.block();
    find.on('success', function() {
        console.log('Found wood!')
    })
    find.on('failure', function() {
        console.log('Unable to find wood!')
    })
    find.succeeds = function (agent) {
        if (agent.brain.wood) {
            return true
        }
        return false;
    }
    // This will never fail so it does not need a failure condition.
    // find.fails = function (agent) {
    //     return false; // this can never fail?
    // }

    var walk = daemonUtils.serial([new DaemonLibrary.StartMoveForward(), new DaemonLibrary.Look()])
    walk.block();
    walk.on('success', function() {
        console.log('Walked to wood!')
    })
    walk.on('failure', function() {
        console.log('Unable to walk to wood!')
    })
    walk.succeeds = function (agent) {
        if(agent.brain.nextToWood() && agent.brain.wood)
            return true;
        return false;
    }
    walk.fails = function (agent) {
        if(!agent.brain.wood) {
            return true;
        }
        return false;
    }

    var chop = daemonUtils.serial([new DaemonLibrary.StopMoveForward(), new DaemonLibrary.Look(), new DaemonLibrary.BreakBlock()])
    chop.block();
    chop.on('success', function() {
        console.log('Chopped wood!')
    })
    chop.on('failure', function() {
        console.log('Unable to chop wood!')
    })
    // succeeds on breaking block?
    chop.succeeds = function (agent) {
        return true;
    }
    chop.fails = function (agent) {
        // no failure for now?
        // if (agent.brain.nextToWood() && !agent.brain.wood) {
        //     return true;
        // }
        return false;
    }

    var get = daemonUtils.serial([find, walk, chop]);
    get.block();
    get.on('success', function() {
        console.log('Completed wood task!')
        this.actionList = null;
    }.bind(this))
    get.on('failure', function() {
        // console.log('Unable to complete wood task!')
    })
    get.succeeds = function () { // No success or failure for now
        return true;
    }
    get.fails = function () {
        return false;
    }

    this.actionList = get;

}

// function rayPlayerHeight(from_player) {
//     var cursor = from_player.entity.position.offset(0, from_player.entity.height, 0);
//     var yaw = from_player.entity.yaw, pitch = from_player.entity.pitch;
//     var vector_length = 0.3;
//     var x = -Math.sin(yaw) * Math.cos(pitch);
//     var y = Math.sin(pitch);
//     var z = -Math.cos(yaw) * Math.cos(pitch);
//     var step_delta = mineflayer.vec3(x * vector_length, y * vector_length, z * vector_length);

//     for (var i = 0; i < 192; i++) {
//         cursor = cursor.plus(step_delta);
//         // console.log(cursor)
//         var block = from_player.blockAt(cursor);
//         if (block.diggable) {
//             return block;
//             // return cursor.floored();
//         }
//     }
//     return undefined;
// };

AgentBrain.prototype.look = function () {
    var entity = this.agent.bot.entity;
    var cursor = entity.position.offset(0, entity.height * 0.75, 0); // Eye Level?
    var vectorLength = 0.3;
    var yaw = entity.yaw, pitch = entity.pitch;
    var x = -Math.sin(yaw) * Math.cos(pitch);
    var y = Math.sin(pitch);
    var z = -Math.cos(yaw) * Math.cos(pitch);
    var step_delta = new Vec3(x * vectorLength, y * vectorLength, z * vectorLength);
    for (var i = 0; i < this.viewDistance; ++i) {
        cursor = cursor.plus(step_delta);
        var block = this.agent.bot.blockAt(cursor);
        if (block !== null && block.boundingBox !== "empty") { // Check if the block is not empty
            if (block.material === "wood")
                this.wood = block;
            else
                this.wood = null;
            break;
        }
    }
}

AgentBrain.prototype.hasWood = function () {
    var inv = this.agent.bot.inventory.slots.filter(Boolean);

    for (var i = inv.length - 1; i >= 0; --i) {
        if (inv[i].type === this.woodID) {
            return true;
        }
    }
    return false;
}

AgentBrain.prototype.nextToWood = function () {
    if(this.wood !== null) {
        if (this.agent.bot.entity.position.distanceTo(this.wood.position) < 2) {
            return true;
        }
    }
    return false;
}

/**
 * Set the action list for brain
 */
AgentBrain.prototype.setActionList = function (actionList) {
    this.actionList = actionList;
}

// AgentBrain.prototype.findItem = function(inventory, itemId) {
//   // Remove empty slots to speed up process
//   var inv = inventory.slots.filter(Boolean);

//   for(var i = inv.length - 1; i >= 0; i--) {
//     if(inv[i].type === itemId) {
//       return inv[i];
//     }
//   }
//   return false;
// }

AgentBrain.prototype.update = function (delta) {
    if (this.actionList)
        this.actionList.update(delta, this.agent);
}

AgentBrain.prototype.pause = function () {
    this.actionList.pause();
}

module.exports = AgentBrain;