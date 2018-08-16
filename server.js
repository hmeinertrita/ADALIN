const Discord = require('discord.js');
const dialogflow = require('dialogflow').v2beta1;
const stream = require('stream');
const fs = require('fs');


const discordClient = new Discord.Client();
const sessionClient = new dialogflow.SessionsClient();

const projectId = "ada-lin";
const languageCode = 'en-US';
var broadcast = null;

discordClient.on('ready', function(){
    broadcast = discordClient.createVoiceBroadcast();
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
        //outputAudioConfig: {
        //  audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
        //}
      })
      .then(responses => {
        message.reply(responses[0].queryResult.fulfillmentText);
        
        //console.log('base64 Audio: ' + responses[0].outputAudio);
        var b64string = responses[0].outputAudio;
        var buf = Buffer.from(b64string, 'base64');
        
        var audioStream = new stream.PassThrough();
        audioStream.end(buf);
        
        var myFile = fs.createWriteStream("test.wav");
        
        //audioStream.pipe(myFile);
        
        broadcast.playStream(audioStream);
        //fs.writeFile('test.wav', buf, 'binary', err => {
        //  if (err) {
        //    console.error('ERROR:', err);
        //    return;
        //  }
        //});
        
        //broadcast.playFile('./test.wav');
        
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

function remove(username, text){
    return text.replace("@" + username + " ", "");
}

discordClient.login('NDc4OTk4Njk4NDA0MjE2ODQ3.DlYLhA.KiLpUKV3-ZfEC43v-P_71uKtwwI');