var Behaviour = require('./behaviour.js');
var ActionLibrary = require('../ActionList/actionLibrary.js')

// Assuming we want one piece of wood


// Get some amount of Wood
function GetWood(agent) { //This would become [FindWood, WalkToWood, ChopWood]
    Behaviour.call(this);
    this.agent = agent;
    this.currentAmount = 0;
    this.amount = 1;
    this.pushBack(new ActionLibrary.Origin()); // Step 1
    // agent.stopMove();
    // agent.look(0, 0);
    // var find = new FindWood();
    // this.pushBack(new ActionLibrary.Look());
    // this.pushBack(new ActionLibrary.TurnHeadRight());
    // this.pushBack(new ActionLibrary.Look());
//    find.pushBack(new ActionLibrary.Look())
//    find.pushBack(new ActionLibrary.StartMoveForward());
    // find.block();
    // find.on('completed', function() {
    //     console.log(agent.name + ' Found wood!')
    // })
    // var walk = new WalkToWood();
    // walk.pushBack(new ActionLibrary.StartMoveForward());
    // walk.pushBack(new ActionLibrary.Look())
    // walk.block();
    //     walk.on('completed', function() {
    //     console.log(agent.name + ' Next to Wood!')
    // })
    // var chop = new ChopWood();
    // chop.pushBack(new ActionLibrary.BreakBlock());
    // chop.block();
    // chop.on('completed', function() {
    //     console.log(agent.name + ' chopped')
    // })

    // this.pushBack(find); // Step 1
}



GetWood.prototype = Object.create(Behaviour.prototype);
GetWood.prototype.constructor = GetWood;

GetWood.prototype.update = function (tick, agent) {

    if (this.currentAmount >= this.amount) {
        this.complete();
    } else if (this.size === 0) {
        // this.parent.pushBack(new FindWood());
    } else {
        Behaviour.prototype.update.call(this, tick, agent); // I have no idea how this would work?
    }
}

// function Learning(actionList, goal, trials) {
//     this.actionList = actionList;
//     this.goal = goal;
//     this.trials = trials;
//     this.trialsCounter = 0;

//     Behaviour.call(this);
// }

// FindWood.prototype = Object.create(Behaviour.prototype);
// FindWood.prototype.constructor = FindWood;

// When would we have an action modify 
function FindWood(actionNameList) {
    Behaviour.call(this, actionNameList);
    this.trials = 25;
    this.trialsCounter = 0;
    this.succeeded = false;
}


FindWood.prototype = Object.create(Behaviour.prototype);
FindWood.prototype.constructor = FindWood;

FindWood.prototype.update = function (tick, agent) {
   // console.log(this.size)
   if(this.trialsCounter >= this.trials) {
       console.log("Failed");
       this.complete();
   }

    if (agent.brain.wood) {
        // this.parent.pushBack(new WalkToWood())
        this.succeeded = true;
        console.log(agent.name + ' Found wood! after ' + this.trialsCounter + ' trials');
        this.complete();
    } else if (this.size === 0) {
        this.loadActionList();
        // this.pushBack(new ActionLibrary.Look());
        // this.pushBack(new ActionLibrary.TurnHeadRight());
        //  this.pushBack(new ActionLibrary.Look());
        // this.pushBack(new ActionLibrary.LookRandom());
        this.trialsCounter++;
    } else {
        Behaviour.prototype.update.call(this, tick, agent);
    }
}

function WalkToWood() { //This would become [BrainLook, MoveForward]
    Behaviour.call(this);
}

WalkToWood.prototype = Object.create(Behaviour.prototype);
WalkToWood.prototype.constructor = WalkToWood;

WalkToWood.prototype.update = function (tick, agent) {
    if (agent.brain.nextToWood()) {
        // Chop Wood
        agent.stopMove();
        // this.parent.pushBack(new ChopWood());
        this.complete();
    } else if (!agent.brain.wood) {
        // Find Wood 
        var wood = new FindWood();
        wood.block();
        this.parent.pushFront(wood); // we have to find wood before we can chop it
    } else {
        Behaviour.prototype.update.call(this, tick, agent);
    }
}

function ChopWood() { //This would become [BrainLook, SwingArm]
    Behaviour.call(this);
}

ChopWood.prototype = Object.create(Behaviour.prototype);
ChopWood.prototype.constructor = ChopWood;

ChopWood.prototype.update = function (tick, agent) {
    if (!agent.brain.wood) {
        // this.parent.currentAmount++;
        this.complete();
    } else if (agent.brain.nextToWood() && agent.brain.wood) {
        Behaviour.prototype.update.call(this, tick, agent);
    }
}




module.exports = {
    GetWood,
    FindWood,
    ChopWood,
    WalkToWood
}

