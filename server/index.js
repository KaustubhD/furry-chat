"use strict"

const PORT = 6900
let webSocketServer = require('websocket').server
let http = require('http')
let randomMC = require('random-material-color')


let server = http.createServer((req, res) => {
  console.log("HTTP server : " + new Date() + ' Requested : ' + req.url)
})

server.listen(PORT, () => {
  console.log("Server listening on port " + PORT)
})

let wsServer = new webSocketServer({
  httpServer: server
})

let clients = []


wsServer.on('request', req => {
  // console.log(req)
  let conn = req.accept(null, req.origin)

  let userName = ''
  let userColor = ''
  console.log('Connection accepted')
  let ind = clients.push(conn) - 1
  

  // console.log(clients)

  // History part here


  conn.on('message', message => {
    if(message.type === 'utf8'){
      
      if(!userName){
        userName = parseIt(message.utf8Data)
        userColor = randomMC.getColor()
        // clients.push({userName, userColor})
        conn.sendUTF(JSON.stringify({
          type: 'color',
          data: {
            userColor
          }
        }))
        console.log(`New user named \"${userName}\" just joined.`)
      }
      else{
        console.log(`New message from ${userName}: \"${message.utf8Data}\"`)
        let obj = {
          type: 'message',
          data: {
            time: new Date().toLocaleTimeString(),
            data: parseIt(message.utf8Data),
            userName,
            userColor
          }
        }
        let jsonString = JSON.stringify(obj)

        // console.log(clients[0])
        console.log(clients.length)
        for(let i = 0; i < clients.length; i++){
          clients[i].sendUTF(jsonString)
        }

      }
    }
  }) // on 'message'

  conn.on('close', connection => {
    if(userName && userColor){
      console.log(`${userName} has left the conversation`)
      clients.splice(ind, 1)
    }
  })

}) // on 'request'


let parseIt = strin => {
  return strin.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
