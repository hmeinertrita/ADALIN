const discordIntegration = require('./discord-integration');

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'credentials.json';

discordIntegration.init('ada-lin', 'en-US');
