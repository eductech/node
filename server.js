const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const cache = {}

const send404 = (response) => {
  response.writeHead(404, {'Content-Type': 'text/plain'})
  response.write('Error 404: resource not found.')
  response.end()
}

const sendFile = (response, filePath, fileContents) => {
  response.writeHead(
    200,
    {'content-type': mime.lookup(path.basename(filePath))}
  )
  response.end(fileContents)
}

const serveStatic = (response, cach, absPath) => {
  if (cach[absPath]) {
    sendFile(response, absPath, cache[absPath])
  } else {
    fs.exists(absPath, (exists) => {
      if (exists) {
        fs.readFile(absPath, (err, data) => {
          if (err) {
            send404(response)
          } else {
            cach[absPath] = data
            sendFile(response, absPath, data)
          }
        })
      } else {
        send404(response)
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
  serveStatic(response, cach, absPath)
})

server.listen(3000, () => {
  console.log('Server listening on port 3000.')
})
