
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

    var actionNameList = ['Look', 'TurnHeadRight'];

    var testSequence = new learningBeharivourLibrary.GetWood(agent); // Objective / Testing Objective
    var find = new learningBeharivourLibrary.FindWood(actionNameList);
    // find.pushBack(new ActionLibrary.Look());
    // find.pushBack(new ActionLibrary.TurnHeadRight());
    find.block();
    find.on('completed', function() {
        //console.log(agent.name + ' Found wood!')
    })
    testSequence.pushBack(find); // Step 1

    agent.setActionList(testSequence);
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
function test(agent) {
    agent.update();
    test(agent);
}



module.exports = LearningAgentManager;



