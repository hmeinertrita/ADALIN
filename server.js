var fetch = require("node-fetch");
const agentId = 'ada-lin';

// const discordIntegration = require('./discord-integration');
// const fs = require('fs');
//
// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'credentials.json';
// const tokens = JSON.parse(fs.readFileSync('tokens.json'));
//
// discordIntegration.init('ada-lin', 'en-US', tokens.DISCORD_TOKEN);

//fetch('https://dialogflow.googleapis.com/v2beta1/projects/' + agentId + '/knowledgeBases')
// .then((response) => {
//   response.json()
//   .then((data) => {
//     console.log(data);
//   });
// });
const dialogflow = require('dialogflow').v2beta1;
const sessionClient = new dialogflow.SessionsClient();

sessionClient.detectIntent({
  session: sessionClient.sessionPath(agentId, 'authTest'),
  queryInput: {
    text: {
      text: 'hello',
      languageCode: 'en-US',
    },
  },
})
.then(responses => {
  console.log(responses);
})
.catch(err => {
  console.error('ERROR:', err);
});
