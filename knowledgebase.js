const dialogflow = require('dialogflow').v2beta1;

function findKnowledgeBase(projectid, displayName) {
  resources = await listKnowledgeBases(projectId);
  resources.forEach(r => {
    if (r.displayName === displayName) {
      return r;
    }
  });
}

async function listKnowledgeBases(projectId) {
  // Instantiate a DialogFlow KnowledgeBasesClient.
  const client = new dialogflow.KnowledgeBasesClient({
    projectPath: projectId,
  });

  const formattedParent = client.projectPath(projectId);

  const [resources] = await client.listKnowledgeBases({
    parent: formattedParent,
  });
  return resources;
}

function findDocument(projectid, displayName) {
  resources = await listDocuments(projectId);
  resources.forEach(r => {
    if (r.displayName === displayName) {
      return r;
    }
  });
}

async function listDocuments(projectId, knowledgeBaseFullName) {
  // Instantiate a DialogFlow Documents client.
  const client = new dialogflow.DocumentsClient({
    projectId: projectId,
  });

  const [resources] = await client.listDocuments({
    parent: knowledgeBaseFullName,
  });
  return resources;
}

async function deleteDocument(projectId, documentId) {
  // Instantiate a DialogFlow Documents client.
  const client = new dialogflow.DocumentsClient({
    projectId: projectId,
  });

  const [operation] = await client.deleteDocument({name: documentId});
  const responses = await operation.promise();
  if (responses[2].done === true) console.log(`document deleted`);
}

async function createDocument(projectId, documentName, knowledgeBaseFullName, rawContent) {
  // Instantiate a DialogFlow Documents client.
  const client = new dialogflow.DocumentsClient({
    projectId: projectId,
  });

  const request = {
    parent: knowledgeBaseFullName,
    document: {
      knowledgeTypes: ['EXTRACTIVE_QA'],
      displayName: documentName,
      rawContent: rawContent,
      source: 'rawContent',
      mimeType: 'text/html',
    },
  };
  console.log(request.document.rawContent);

  const [operation] = await client.createDocument(request);
  const [response] = await operation.promise();
  console.log('document created');
}

module.exports = {
  createDocument: createDocument,
  deleteDocument: deleteDocument,
  listDocuments: listDocuments,
  findDocument: findDocument,
  listKnowledgeBases: listKnowledgeBases,
  findKnowledgeBase: findKnowledgeBase
};
