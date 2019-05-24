const adalin = require('./adalin/module')
const wiki = require('./tiddlywiki/module')
const fs = require('fs')

async function start() {
  const options = JSON.parse(await fs.promises.readFile('options.json'))
  const tokens = JSON.parse(await fs.promises.readFile('tokens.json'))

  await wiki(options)
  adalin(options, tokens.discordToken)
}

start()
