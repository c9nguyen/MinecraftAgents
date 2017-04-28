
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
    this.almManager = new ActionLearningMaterialManager();
    this.almManager.addMaterial(['Look', 'Look']);
    this.almManager.addMaterial(['LookRandom', 'Look']);
    this.almManager.addMaterial(['TurnHeadRight', 'TurnHeadRight', 'Look']);
    this.almManager.addMaterial(['TurnHeadRight', 'TurnHeadLeft', 'Look']);
    this.almManager.addMaterial(['HeadUp', 'Look']);
    this.almManager.addMaterial(['HeadDown', 'TurnHeadLeft']);
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
        setInterval(agent.update.bind(agent), 100); // give our agent a reaction time?
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
        this.almManager.mutate();
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

ActionLearningMaterialManager.prototype.generateRandomMaterials = function(size) {
    for (var i = 0; i < size; i++) {
        var actionList = 
        this.materialList
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
    var actionLibrary = ActionLibrary.GetActionList();
    
    //need rework on searching method
    this.materialList.map(function(material) {
        if (lowestTicket === undefined || lowestTicket > material.ticket) {
            lowestMaterial = material;
            lowestTicket = material.ticket;
        }
    });

    this.materialList.map(function(material) {
        if (highestTicket === undefined || highestTicket < material.ticket) {
            highestMaterial = material;
            highestTicket = material.ticket;
        }
    });

    //Copying action from highest material
    // console.log("Before: " + highestMaterial.actionList);
    lowestMaterial.actionList.splice(0, lowestMaterial.actionList.length);
    highestMaterial.actionList.map(function(action) {
        lowestMaterial.actionList.push(action);
    });

    var randomIndex = Math.floor(Math.random() * actionLibrary.length);
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

ActionLearningMaterialManager.prototype.addMaterial = function(actionNameList) {
    this.materialList.push(new ActionLearningMaterial(actionNameList));
}

ActionLearningMaterialManager.prototype.getMaterialAction = function(index) {
    return this.materialList[index].actionList;
}

ActionLearningMaterialManager.prototype.materialReport = function(index, result) {
    if (result) //if the material succeed
        this.materialList[index].increase();
    else //failed
        this.materialList[index].decrease();
}

/* ================================================================================= */

/**
 * An action material
 * @param {*} actionList 
 * @param {*} ticket number of ticket
 */
function ActionLearningMaterial(actionList, ticket = 10) {
    this.actionList = actionList;
    this.ticket = ticket;
}

/**
 * Dencrease number of ticket
 * Min = 1
 */
ActionLearningMaterial.prototype.decrease = function(amount = 1) {
    this.ticket -= amount;
    this.ticket = Math.max(this.ticket, 1);
}

/**
 * Increase number of ticket
 * Max = 20
 */
ActionLearningMaterial.prototype.increase = function(amount = 1) {
    this.ticket += amount;
    this.ticket = Math.min(this.ticket, 20);
}

module.exports = LearningAgentManager;





module.exports = LearningAgentManager;



