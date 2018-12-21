const discordIntegration = require('./discord-integration');
const fs = require('fs');

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'credentials.json';
const tokens = JSON.parse(fs.readFileSync('tokens.json'));

discordIntegration.init('ada-lin', 'en-US', tokens.DISCORD_TOKEN);
