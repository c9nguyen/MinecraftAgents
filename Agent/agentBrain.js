
// var States = {
//     CUTTINGWOOD = 0,
//     LOOKINGFORWOOD = 1,
// }

// Maybe use node event emitter?
// agentBrain.on('foundWood'), agent.on('selectedAction')
var ActionList = require('../ActionList/actionList.js')
var actionUtils = require('../ActionList/actionUtils.js')
var ActionLibrary = require('../ActionList/actionLibrary.js');
var BehaviourLibrary = require('../Behaviour/behaviourLibrary.js');
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
    this.viewDistance = 10;
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

    var testSequence = new BehaviourLibrary.GetWood(); // Objective / Testing Objective
    var find = new BehaviourLibrary.FindWood();
    find.pushBack(new ActionLibrary.LookRandom());
    find.pushBack(new ActionLibrary.Look())
//    find.pushBack(new ActionLibrary.StartMoveForward());
    find.block();
    find.on('completed', function() {
        console.log(self.agent.name + ' Found wood!')
    })
    var walk = new BehaviourLibrary.WalkToWood();
    walk.pushBack(new ActionLibrary.StartMoveForward());
    walk.pushBack(new ActionLibrary.Look())
    walk.block();
        walk.on('completed', function() {
        console.log(self.agent.name + ' Next to Wood!')
    })
    var chop = new BehaviourLibrary.ChopWood();
    chop.pushBack(new ActionLibrary.BreakBlock());
    chop.block();
    chop.on('completed', function() {
        console.log(self.agent.name + ' chopped')
    })
    testSequence.pushBack(find); // Step 1
    // testSequence.pushBack(walk); // Step 2
    // testSequence.pushBack(chop); // Step 3
    this.actionList = testSequence;
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
   //         console.log(block)
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
            if (this.agent.bot.entity.position.distanceTo(this.wood.position) < 2)
    {
        return true;
    }
    }

    return false;
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
    this.actionList.update(delta, this.agent);
}

AgentBrain.prototype.pause = function () {
    this.actionList.pause();
}

module.exports = AgentBrain;