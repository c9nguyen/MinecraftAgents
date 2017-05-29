
var mineflayer = require('mineflayer');
var learningBeharivourLibrary = require('../Behaviour/learningBeharivourLibrary.js');
var ActionLibrary = require('../ActionList/actionLibrary.js')
// When we want to run multiple agents this will be helpful
var Agent = require('./agent.js')
function LearningAgentManager(host, port, amount) {
    this.host = host || "localhost";
    this.port = port || 25565;
    this.agents = [];
    this.amount = amount || 1;
}

LearningAgentManager.prototype.start = function () {
    var startingSize = 5;

    this.almManager = new ActionLearningMaterialManager();
    this.almManager.generateRandomMaterials(10, startingSize);
    // this.almManager.addMaterial(['Look']);
    // this.almManager.addMaterial(['LookRandom']);
    // this.almManager.addMaterial(['TurnHeadRight']);
    // this.almManager.addMaterial(['TurnHeadLeft']);
    // this.almManager.addMaterial(['HeadUp']);
    // this.almManager.addMaterial(['HeadDown']);
    this.runCounter = 0; 

    for (var i = 0; i < this.amount; ++i) {
        console.log("Spawning");
        this.spawnAgent(i);
    } 


    // this.startLoop();
    // console.log("Agents are ready!")
    // this.loop();
}
// The agent will not spawn while I am excuting other code???
LearningAgentManager.prototype.spawnAgent = function (id) {
    var self = this;

    var name = "Agent_" + id;
    var bot = mineflayer.createBot({
        host: this.host,
        port: this.port,
        username: name,
        // password: process.argv[5], // sorry microsoft :'(
        verbose: true,
    });
    var agent = new Agent(bot, name, self);
    bot.on('spawn', function() {
        // var test = new Agent(this);
        // test.update();
        // if()
        // self.startLoop(true);
        setInterval(agent.update.bind(agent), 50); // give our agent a reaction time?
        // agent.update();
    });
    this.agents.push(agent);

    this.mainAgent = agent; //Working on 1 agent for now

    this.initialActionForAgent(agent);
}
//TODO: update to do multiple agents
LearningAgentManager.prototype.startLoop = function (loop) {
    if (!loop)
        return;
    for (var i = 0; i < this.agents.length; i++) {
        var agent = this.agents[i];
        if (agent.ready()) {
            loop = false;
        }
    }
    this.startLoop(loop)
}

LearningAgentManager.prototype.loop = function () {
    for (var i = 0; i < this.agents.length; i++) {
        var agent = this.agents[i];
        agent.update();
    }
    this.loop();
}

LearningAgentManager.prototype.initialActionForAgent = function (agent) {
    var self = this;
    agent.brain.wood = false;
    var testSequence = new learningBeharivourLibrary.GetWood(agent); // Objective / Testing Objective

    this.runCounter++;
    if (this.runCounter >= 5) {
        //this.almManager.mutate();
        this.runCounter = 1;
    }

    //Get a random actionlist
    var randomIndex = this.almManager.randomMaterialIndex();
    var actionList = this.almManager.getMaterialAction(randomIndex);
    console.log(actionList + " ticket: " + this.almManager.materialList[randomIndex].ticket);

    var find = new learningBeharivourLibrary.FindWood(actionList);
    // find.pushBack(new ActionLibrary.Look());
    // find.pushBack(new ActionLibrary.TurnHeadRight());
    find.block();
    find.on('completed', function() {
        //console.log(agent.name + ' Found wood!')
        self.almManager.materialReport(randomIndex, find.succeeded);
        self.initialActionForAgent(agent);
    })
    testSequence.pushBack(find); // Step 1

    this.mainAgent.setActionList(testSequence);
}

function test(agent) {
    agent.update();
    test(agent);
}

/* ================================================================================= */

function ActionLearningMaterialManager() {
    this.materialList = [];
}

/**
 * Generate size number of random materials
 */
ActionLearningMaterialManager.prototype.generateRandomMaterials = function(size = 1, numberOfActions = 1) {
    while (size -- > 0) {
        var random = Math.floor(Math.random() * numberOfActions) + 1;         //random number of actions of new material
        var newMaterial = this.createMaterial();
        newMaterial.generateRandomActionList(random);
    }
}

/**
 * Return an random material and its index
 * probability depends on number of tickets of material
 */
ActionLearningMaterialManager.prototype.randomMaterialIndex = function() {
    if (this.materialList.length < 1) return -1;

    //Count number of ticket
    var totalTicket = 0, index;
    this.materialList.map(function(material) {
        totalTicket += material.ticket;
    });

    //Choose a random value between 0 and total number of ticket
    var randomValue = Math.floor(Math.random() * totalTicket);

  //  console.log("total Ticket: " + totalTicket + " randomValue: " + randomValue);

    //When the random value ran out, the current index is selected
    for (index = 0; index < this.materialList.length && randomValue >= 0; index++) {

        randomValue -= this.materialList[index].ticket;
  //      console.log("randomValue: " + randomValue + " ticket: " + this.materialList[index].ticket);
    }
  //  console.log("Selected: " + (--index));
    return --index;
}

/**
 *
 */
ActionLearningMaterialManager.prototype.mutate = function() {
    var lowestMaterial, lowestTicket, highestMaterial, highestTicket;
    var lowestMaterialList = [], highestMaterialList = [];
    var actionLibrary = ActionLibrary.getActionList();
    
    //need rework on searching method

    //Search for lowest and highest ticket values
    this.materialList.map(function(material) {
        if (lowestTicket === undefined || lowestTicket > material.ticket) {
            lowestTicket = material.ticket;
        }
    });

    this.materialList.map(function(material) {
        if (highestTicket === undefined || highestTicket < material.ticket) {
            highestTicket = material.ticket;
        }
    });

    //Gathering materials with lowest and highest values
    this.materialList.map(function(material) {
        if (lowestTicket === material.ticket) {
            lowestMaterialList.push(material);
        }

        if (highestTicket === material.ticket) {
            highestMaterialList.push(material);
        }
    });

    var randomIndex = Math.floor(Math.random() * lowestMaterialList.length);
    lowestMaterial = lowestMaterialList[randomIndex];
    randomIndex = Math.floor(Math.random() * highestMaterialList.length);
    highestMaterial = highestMaterialList[randomIndex];

    //Copying action from highest material
    // console.log("Before: " + highestMaterial.actionList);
    lowestMaterial.actionList.splice(0, lowestMaterial.actionList.length);
    highestMaterial.actionList.map(function(action) {
        lowestMaterial.actionList.push(action);
    });

    randomIndex = Math.floor(Math.random() * actionLibrary.length);
    var randomAction = actionLibrary[randomIndex]; //get a random action from action list library
    randomIndex = Math.floor(Math.random() * lowestMaterial.actionList.length);
    lowestMaterial.actionList[randomIndex] = randomAction; //mutate a random action
    lowestMaterial.ticket = 10;
    // console.log("randonIndex: " + randomIndex);
    // console.log("Mutated: " + lowestMaterial.actionList);

    //mutate second material
    lowestTicket = undefined
    this.materialList.map(function(material) {
        if (lowestTicket === undefined || lowestTicket > material.ticket) {
            lowestMaterial = material;
            lowestTicket = material.ticket;
        }
    });

    //Copying action from highest material
    lowestMaterial.actionList.splice(0, lowestMaterial.actionList.length);
    highestMaterial.actionList.map(function(action) {
        lowestMaterial.actionList.push(action);
    });

    var randomIndex = Math.floor(Math.random() * actionLibrary.length);
    var randomAction = actionLibrary[randomIndex]; //get a random action from action list library
    lowestMaterial.actionList.push(randomAction);
    // console.log("Mutated: " + lowestMaterial.actionList);
}

/**
 * Mutate a material. If second material is passed in, copy from that material to mutate
 * 
 */
ActionLearningMaterialManager.prototype.mutateMaterial = function(materialIndexDes, materialIndexFrom) {
    var mutationMaterial = this.materialList[materialIndexDes];
    var actionListDes = mutationMaterial.actionList;

    actionListDes.splice(0, actionListDes.length);
    materialIndexFrom.actionList.map(function(action) {
        actionListDes.push(action);
    });

}

/**
 * Create a new material and push to the list 
 * return the new material
 */
ActionLearningMaterialManager.prototype.createMaterial = function(actionNameList = []) {
    var newMaterial = new ActionLearningMaterial(actionNameList)
    this.materialList.push(newMaterial);
    return newMaterial;
}

/**
 * 
 */
ActionLearningMaterialManager.prototype.addMaterial = function(newMaterial) {
    this.materialList.push(newMaterial);
}

/**
 * 
 */
ActionLearningMaterialManager.prototype.getMaterialAction = function(index) {
    return this.materialList[index].actionList;
}

/**
 * A material report back with the result
 * An action will be taken here depends on the result
 */
ActionLearningMaterialManager.prototype.materialReport = function(index, result) {
    var randomRoll = (Math.random() * 100);
    var deleteRate = 5;
    var copyRate = 5;
    var addActionRate = 10;
    console.log(this.materialList.length);
    this.materialList[index].report(result);
    if (result && randomRoll < copyRate) {
        console.log("copied"); 
        var newMaterial = this.createMaterial(this.materialList[index].getActionList());
        newMaterial.mutate();   //mutate the new material
    } else if (randomRoll < deleteRate) {
        //if material list is too small, add a random one with size of the one to be deleted + 1
        if (this.materialList.length < 6) {
         //   var random = Math.floor(Math.random() * this.materialList[index].getActionList.length + 1) + 1;         //random number of actions of new material
            var newMaterial = this.createMaterial();
            newMaterial.generateRandomActionList(this.materialList[index].getActionList().length);

            console.log("Lenght: " + this.materialList[index].getActionList().length);
            //Chance to add 1 additional action
            if (Math.floor(Math.random() * 100) <= addActionRate) {
                newMaterial.addRandomAction();
            } 

        }  
        this.materialList.splice(index, 1);
        console.log("deleted"); 

    }

}

/* ================================================================================= */

/**
 * An action material
 * @param {*} actionList 
 * @param {*} ticket number of ticket
 */
function ActionLearningMaterial(actionList = [], ticket = 10) {
    this.actionList = actionList;
    this.ticket = ticket;
    this.trial = 0;
    this.succeeded = 0;
}

/**
 * generate a randon list of actions
 */
ActionLearningMaterial.prototype.generateRandomActionList = function(size) {
    var actionList = ActionLibrary.getActionList();

    while(size-- > 0) {
        this.addRandomAction();
    }
}

/**
 * Add 1 random action into the list
 */
ActionLearningMaterial.prototype.addRandomAction = function() {
    var actionList = ActionLibrary.getActionList();
    var random = Math.floor(Math.random() * actionList.length);
    this.actionList.push(actionList[random]);
}




/**
 * 
 */
ActionLearningMaterial.prototype.report = function(result) {
    this.trial++;
    if (result) {
        this.succeeded++;
        this.ticket += 2;
        this.ticket = Math.min(this.ticket, 20);
    } else {
        this.ticket -= 1;
        this.ticket = Math.max(this.ticket, 1);
    }

}

/**
 * Return a clone of action list
 */
ActionLearningMaterial.prototype.getActionList = function() {
    var cloneList = [];
    this.actionList.map(function(action) {
        cloneList.push(action);
    });

    return cloneList;
}

/**
 *  Mutate the action list of the material
 */
ActionLearningMaterial.prototype.mutate = function() {
    var mutationRate = 5;
    var actionList = ActionLibrary.getActionList();
    
    for (var i = 0; i < this.actionList; i++) {
        if (Math.floor(Math.random() * 100) <= mutationRate) {
            var random = Math.floor(Math.random() * actionList.length);
            this.actionList[i] = actionList[random];
        }
    }

    //Chance to add 1 additional action
    if (Math.floor(Math.random() * 100) <= mutationRate) {
        this.addRandomAction();
    } 
}

/**
 * Increase number of ticket
 * Max = 20
 */
ActionLearningMaterial.prototype.reset = function() {
    this.trial = 0;
    this.succeeded = 0;
    this.ticket = 10;
}

module.exports = LearningAgentManager;





module.exports = LearningAgentManager;



