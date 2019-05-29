const Discord = require('discord.js');
const stream = require('stream');
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg');

let projectId
let sessionClient
let languageCode
let broadcast
let discordClient

function handleAudioResponse(response) {
  if (response.outputAudioConfig) {
    var audioBuffer = response.outputAudio
    var audioStream = new stream.PassThrough()
    audioStream.end(audioBuffer)
    broadcast.playStream(audioStream)

    for (const connection of discordClient.voiceConnections.values()) {
      connection.playBroadcast(broadcast)
    }
  }
}

function detectIntentAudio(audioStream) {
  var buffers = [];
  console.log("detecting intent")
  ffmpeg(audioStream)
  .inputFormat('s32le')
  .format('s16le')
  .pipe()
  .on('data', d => { buffers.push(d) })
  .on('end', async () => {
    console.log('sending audio')
    const audioBuffer = Buffer.concat(buffers)
    //const base64Audio = audioBuffer.toString('base64');
    const responses = await sessionClient.detectIntent({
      session: sessionClient.sessionPath(projectId, 'voiceTest'),
      queryInput: {
        audioConfig: {
          audioEncoding: 'AUDIO_ENCODING_LINEAR_16',
          sampleRateHertz: 48000,
          languageCode: languageCode
        },
      },
      inputAudio: audioBuffer
    })

    console.log(responses[0])
    handleAudioResponse(responses[0])
  })
}

async function detectIntentMessage(message) {
  var mess = remove(discordClient.user.username, message.cleanContent);
  console.log('recieved input: ' + mess);
  const user = message.author.id;
  const responses = await sessionClient.detectIntent({
    session: sessionClient.sessionPath(projectId, user),
    queryInput: {
      text: {
        text: mess,
        languageCode: languageCode,
      },
    },
  })
  message.reply(responses[0].queryResult.fulfillmentText);
  handleAudioResponse(responses[0])
}

async function joinVoiceChannel(voiceChannel) {
  console.log('joining voice channel...');
  const connection = await voiceChannel.join()
  broadcast.playFile(__dirname + '/silence.mp3')
  connection.playBroadcast(broadcast);
  const receiver = connection.createReceiver()

  connection.on('speaking', (user, speaking) => {
    if (speaking) {
      const audioStream = receiver.createPCMStream(user);
      console.log(`I'm listening to ${user}`);
      detectIntentAudio(audioStream)
    }
  });
}

function init(sClient, pId, lCode, token) {
  sessionClient = sClient
  projectId = pId
  languageCode = lCode
  discordClient = new Discord.Client();

  discordClient.on('ready', function(){
    broadcast = discordClient.createVoiceBroadcast();
    console.log("discord client ready");
  });

  discordClient.on('message', function(message){
    if((message.cleanContent.startsWith("@" + discordClient.user.username) || message.channel.type == 'dm') && discordClient.user.id != message.author.id){
      detectIntentMessage(message)
    }
    else if (message.cleanContent === 'jm') {
      if (message.member.voiceChannel) {
        joinVoiceChannel(message.member.voiceChannel)
        message.reply('I have successfully connected to the channel!')
      } else {
        message.reply('You need to join a voice channel first!')
      }
    }
    else if (message.cleanContent === 'lm') {
      if (message.member.voiceChannel) {
        console.log('leaving voice channel...');
        message.member.voiceChannel.leave();
        message.reply('I have successfully left the channel!');
      } else {
        message.reply('You need to join me here first!');
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
