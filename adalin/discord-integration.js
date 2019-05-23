const Discord = require('discord.js');
const stream = require('stream');

function init(sessionClient, projectId, languageCode, token) {
  const discordClient = new Discord.Client();
  var broadcast = null;

  discordClient.on('ready', function(){
    broadcast = discordClient.createVoiceBroadcast();
    console.log("Discord Client ready");
  });

  discordClient.on('message', function(message){
    if((message.cleanContent.startsWith("@" + discordClient.user.username) || message.channel.type == 'dm') && discordClient.user.id != message.author.id){
      var mess = remove(discordClient.user.username, message.cleanContent);
      console.log('recieved input: ' + mess);
      if (mess === 'join me!') {
        if (message.member.voiceChannel) {
          console.log('joining voice channel...');
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
          console.log('leaving voice channel...');
          message.member.voiceChannel.leave();
          message.reply('I have successfully left the channel!');
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
          var b64string = responses[0].outputAudio;
          var buf = Buffer.from(b64string, 'base64');
          var audioStream = new stream.PassThrough();
          audioStream.end(buf);
          broadcast.playStream(audioStream);

          for (const connection of discordClient.voiceConnections.values()) {
            connection.playBroadcast(broadcast);
          }
        })
        .catch(err => {
          console.error('ERROR:', err);
        });
      }
    }
  });

  discordClient.login(token);

  return ({
    'discord': discordClient,
    'dialogflow': sessionClient
  });
}

function remove(username, text){
  return text.replace("@" + username + " ", "");
}

module.exports = init
