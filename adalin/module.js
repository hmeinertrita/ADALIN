const dialogflow = require('dialogflow').v2beta1
const knowledgebase = require('./knowledgebase')
const discordIntegration = require('./discord-integration')
const fs = require('fs')

const agent = {
  projectId: 'ada-lin',
  agentId: 'ada-lin',
  knowledgeBaseDisplayName: 'test'
}

async function init(options, discordToken) {
  const sessionClient = new dialogflow.SessionsClient({ keyFilename: options.crendentialsPath })
  loadWiki(options.exportPath + '/' + options.wikiFileName)
  //discordIntegration(sessionClient, 'ada-lin', 'en-US', discordToken)
}

function findResourceName(resources, displayName) {
  resources.forEach(r => {
    if (r.displayName === displayName) {
      console.log("Found KB! '" + r.displayName + "'")
      return r;
    }
  });
}

async function refreshKnowledgeBase(html) {
  const encodedHtml = Buffer.from(html).toString('base64')
  const knowledgebases = await knowledgebase.listKnowledgeBases(agent.projectId)
  let knowledgebaseName;

  knowledgebases.forEach(r => {
    if (r.displayName === agent.knowledgeBaseDisplayName) {
      knowledgebaseName = r.name;
    }
  });

  const documents = await knowledgebase.listDocuments(agent.projectId, knowledgebaseName)
  let documentName;

  documents.forEach(r => {
    if (r.displayName === agent.knowledgeBaseDisplayName) {
      documentName = r.name;
    }
  });

  if (documentName !== undefined) {
    await knowledgebase.deleteDocument(agent.projectId, documentName)
  }

  //CONTENT PROPERTY TO BE DEPRECATED! SWITCH TO BASE64 ENCODED STRING ONCE 'rawContent' is implemented
  await knowledgebase.createDocument(agent.projectId, agent.knowledgeBaseDisplayName, knowledgebaseName, encodedHtml)
}

async function loadWiki(filePath) {
  const data = await fs.promises.readFile(filePath)
  refreshKnowledgeBase(data+'')
}

module.exports = init
