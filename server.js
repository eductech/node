const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')

const chatServer = require('./lib/chatServer.js')

const cache = {}

const send404 = (response) => {
  response.writeHead(404, {'Content-Type': 'text/plain'})
  response.write('Error 404: resource not found.')
  response.end()
}

const sendFile = (response, filePath, fileContents) => {
  response.writeHead(
    200,
    {'content-type': mime.getType(path.basename(filePath))}
  )
  response.end(fileContents)
}

const serveStatic = (response, cache, absPath) => {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath])
  } else {
    fs.access(absPath, (err) => {
      if (err) {
        send404(response)
      } else {
        fs.readFile(absPath, (err, data) => {
          if (err) {
            send404(response)
          } else {
            cache[absPath] = data
            sendFile(response, absPath, data)
          }
        })        
      }
    })
  }
}

const server = http.createServer((request, response) => {
  let filePath = false

  if (request.url == '/') {
    filePath = 'public/index.html'
  } else {
    filePath = 'public' + request.url
  }

  const absPath = './' + filePath
  serveStatic(response, cache, absPath)
})

server.listen(3000, () => {
  console.log('Server listening on port 3000.')
})

chatServer.listen(server)
