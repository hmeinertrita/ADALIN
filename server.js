const adalin = require('./adalin/module');
const wiki = require('./wiki/module');
const fs = require('fs')

const options = await fs.promises.readFile('options.json');
const tokens = await fs.promises.readFile('tokens.json');
const credentials = await fs.promises.readFile('credentials.json');

await wiki(options, tokens.discordToken);
adalin(options);
