var LearningAgentManager = require('./Agent/learningAgentManager.js');
var actionUtils = require('./ActionList/actionUtils');

if(process.argv.length < 4 || process.argv.length > 5) {
  console.log("Usage : node index.js <host> <port> [<numberOfBots>]");
  process.exit(1);
}


var agentManager = new LearningAgentManager(process.argv[2], parseInt(process.argv[3]), parseInt(process.argv[4]));


agentManager.start();