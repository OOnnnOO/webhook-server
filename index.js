const http = require('http')
const {
  exec
} = require('child_process')
const PORT = 9988
const PATH = '/var/www/oonnnoo/test/'

const server = http.createServer(function (request, response) {
  if (request.url.search(/deploy\/?$/i) > 0 && require) {
    let commands = [
      'cd ' + PATH,
      'git pull'
    ].join(' && ');

    exec(commands, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        response.writeHead(500)
        response.end('Server Internal Error.')
        return;
      }
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
      response.writeHead(200)
      response.end('Deploy Done.')
    })
  } else {
    response.writeHead(404)
    response.end('Not Found.')
  }
})

server.listen(PORT)
