const dialogflow = require('dialogflow').v2beta1
const knowledgebase = require('./knowledgebase')
const discordIntegration = require('./discord-integration')
const fs = require('fs')

const agent = {
  projectId: 'ada-lin',
  agentId: 'ada-lin',
  knowledgeBaseDisplayName: 'wiki'
}
const sessionClient = new dialogflow.SessionsClient({ keyFilename: "credentials.json" })

async function init(options) {
  loadWiki(options.exportPath, options.wikiFileName)
  const tokens = JSON.parse(await fs.promises.readFile(options.tokenPath))
  //discordIntegration(sessionClient, 'ada-lin', 'en-US', tokens.DISCORD_TOKEN)
}

async function refreshKnowledgeBase(html) {
  const encodedHtml = Buffer.from(html).toString('base64')
  const knowledgeBaseName = knowledgebase.findKnowledgeBase(agent.projectId, agent.knowledgeBaseDisplayName).name
  const documentName = knowledgebase.findDocument(agent.projectId, agent.knowledgeBaseDisplayName).name

  await knowledgebase.deleteDocument(agent.projectId, documentName)
  knowledgebase.createDocument(agent.projectId, agent.knowledgeBaseDisplayName, knowledgeBaseName, encodedHtml)
}

async function loadWiki(exportPath, fileName) {
  const data = await fs.promises.readFile(exportPath + '/' + fileName)
  refreshKnowledgeBase(data+'')
}

module.exports = init
