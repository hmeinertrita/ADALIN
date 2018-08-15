const Discord = require('discord.js');
var dialogflow = require('dialogflow').v2beta1;
var config = require('discorddialogflow/config');

const discordClient = new Discord.Client();
const sessionClient = new dialogflow.SessionsClient();

const projectId = "ada-lin";
const languageCode = 'en-US';
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
const broadcast;

discordClient.on('ready', function(){
    console.log("Discord Client ready");
});

discordClient.on('message', function(message){
  if((message.cleanContent.startsWith("@" + discordClient.user.username) || message.channel.type == 'dm') && discordClient.user.id != message.author.id){
    var mess = remove(discordClient.user.username, message.cleanContent);
    console.log(mess);
    if (mess === 'join me!') {
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
          .then(connection => { // Connection is an instance of VoiceConnection
            message.reply('I have successfully connected to the channel!');
          })
          .catch(console.log);
      } else {
        message.reply('You need to join a voice channel first!');
      }
    }
    else if (mess === 'leave me!') {
      if (message.member.voiceChannel) {
        message.member.voiceChannel.leave();
        message.reply('I have successfully connected to the channel!');
      } else {
        message.reply('You need to join me here first!');
      }
    }
    else {
      const user = message.author.id;
      sessionClient.detectIntent({
        session: sessionClient.sessionPath(projectId, user),
        queryInput: {
          text: {
            text: mess,
            languageCode: languageCode,
          },
        },
      })
      .then(responses => {
        message.reply(responses[0].queryResult.fulfillmentText);
        for (const connection of client.voiceConnections.values()) {
          connection.playArbiraryInput(responses[0].outputAudio);
        }
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
    }
  }
});
