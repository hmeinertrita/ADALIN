const fs = require('fs')
const fsPromises = fs.promises
const util = require('util')
const exec = util.promisify(require('child_process').exec);

function delay(t, val) {
   return new Promise(function(resolve) {
       setTimeout(function() {
           resolve(val);
       }, t);
   });
}

async function exportStatic(dir, output, wikiFileName) {

  //WORKAROUND USING DELAY! FIX WHEN YOU GET A RESPONSE TO THE GITHUB ISSUE
  //await exec('tiddlywiki ./tiddlywiki/wiki --render [!is[system]sort[title]]')
  exec('tiddlywiki ./tiddlywiki/wiki --render [!is[system]sort[title]]')
  await delay(2000);
  const tiddlers = await fsPromises.readdir(dir)

  var formattedStatic = ''

  tiddlers.forEach(name => {
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
  await exportStatic(__dirname + '/wiki/output', options.exportPath, options.wikiFileName)
  exec('tiddlywiki ./tiddlywiki/wiki --wsserver')
}

module.exports = init
