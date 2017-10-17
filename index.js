const http = require('http')
const url = require('url')
const querystring = require('querystring')
const config = require('./config')
const {
  exec
} = require('child_process')
const PORT = config.port

// URL: http://deploy.oonnnoo.com:9988?project=test-oonnnoo-com
const server = http.createServer(function (request, response) {
  // 获取URL的query部分的值
  let query = url.parse(request.url).query
  // 将query部分值转换成json格式
  let obj = querystring.parse(query)
  // 获取project名，并通过config.json中查找到项目所在文件夹，并在项目文件执行命令。
  let project = obj.project
  if (config.projects[project]) {
    let dir = config.projects[project].path
    let commands = [
      'cd ' + dir,
      'git clean -f',
      'git pull'
    ].join(' && ')
    console.log(commands)

    exec(commands, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        response.writeHead(500)
        response.end('Server Internal Error.')
        return
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
