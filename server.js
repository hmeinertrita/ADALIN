const Discord = require('discord.js');
const client = new Discord.Client();
var dialogflow = require('dialogflow').v2beta1;
var config = require('discorddialogflow/config');

const sessionClient = new dialogflow.SessionsClient();
const projectId = "ada-lin";
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
console.log(sessionPath);

const query = "hello!";

// The text query request.
const request = {
  session: sessionPath,
  queryInput: {
    text: {
      text: query,
      languageCode: languageCode,
    },
  },
};

// Send request and log result
sessionClient
  .detectIntent(request)
  .then(responses => {
    console.log(responses);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
