var fetch = require("node-fetch");
const agentId = 'ada-lin';

const discordIntegration = require('./discord-integration');
const fs = require('fs');

function init() {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = 'credentials.json';
  const tokens = JSON.parse(fs.readFileSync('tokens.json'));

  discordIntegration.init('ada-lin', 'en-US', tokens.DISCORD_TOKEN);
}
module.exports = {
  init: init
}

// const dialogflow = require('dialogflow').v2beta1;
// const sessionClient = new dialogflow.SessionsClient();
//
// sessionClient.detectIntent({
//   session: sessionClient.sessionPath(agentId, 'authTest'),
//   queryInput: {
//     text: {
//       text: 'hello',
//       languageCode: 'en-US',
//     },
//   },
// })
// .then(responses => {
//   console.log(responses);
// })
// .catch(err => {
//   console.error('ERROR:', err);
// });
