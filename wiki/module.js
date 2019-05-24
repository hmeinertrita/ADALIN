const fs = require('fs')
const fsPromises = fs.promises
const util = require('util')
const exec = util.promisify(require('child_process').exec);

async function exportStatic(dir, output, wikiFileName) {
  await exec('ls')
  await exec('tiddlywiki ./wiki --render [!is[system]sort[title]]')
  const tiddlers = await fsPromises.readdir(dir)

  var formattedStatic = ''

  await tiddlers.forEach(name => {
    const filePath = dir + '/' + name
    var html = fs.readFileSync(filePath)
    formattedStatic += formatTiddler(html + '', name) + '\n'
    fs.unlinkSync(filePath)
  })
  fsPromises.writeFile(output + '/' + wikiFileName, formattedStatic)
  fsPromises.rmdir(dir)
}

function formatTiddler(html, filename) {
  for (var i = 5; i > 0; i--) {
    html = html.split('<h' + i).join('<h' + (i+1))
    html = html.split('</h' + i).join('</h' + (i+1))
  }

  const title = filename.replace('.html', '').split('\\').join('')
  const heading = '<h1 class="whole-tiddler-title">' + title + '</h1>'

  html = '<div class="whole-tiddler">' + heading + html + '</div>'
  return html
}

async function init(options) {
  exec('tiddlywiki ./wiki --listen port=' + options.port)
  await exportStatic(__dirname + '/output', options.exportPath, options.wikiFileName)
}

module.exports = init