const dialogflow = require('dialogflow').v2beta1;
const knowledgebase = require('./knowledgebase');
const agent = {
  projectId: 'ada-lin',
  agentId: 'ada-lin',
  knowledgeBaseDisplayName: 'wiki'
};
const sessionClient = new dialogflow.SessionsClient({ keyFilename: "credentials.json" });

const discordIntegration = require('./discord-integration');
const fs = require('fs');

function init() {
  const tokens = JSON.parse(fs.readFileSync('tokens.json'));
  //discordIntegration.init(sessionClient, 'ada-lin', 'en-US', tokens.DISCORD_TOKEN);
}

async function refreshKnowledgeBase(html) {
  const encodedHtml = Buffer.from(html).toString('base64');
  const name = knowledgebase.findKnowledgeBase(agent.projectId, agent.knowledgeBaseDisplayName);

  await knowledgebase.deleteDocument(agent.projectId, name);
  knowledgebase.createDocument(agent.projectId, agent.knowledgeBaseDisplayName, name, encodedHtml);
}

module.exports = {
  init: init
}
