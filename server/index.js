"use strict"
const PORT = process.env.PORT || 6900
let webSocketServer = require('websocket').server
let http = require('http')
let fs = require('fs')
let randomMC = require('random-material-color')


let server = http.createServer((req, res) => {
  console.log("HTTP server : " + new Date() + ' Requested : ' + req.url)
  fs.readFile(__dirname + '/..' + req.url, (err, data) => {
    if(err){
      res.writeHead(404, "Maybe file wasn\'t found")
      res.end(JSON.stringify(err))
      return
    }
    else{
      console.log(`Req url => ${__dirname + '/..' + req.url}`)
      res.writeHead(200)
      res.end(data)
    }
  })
  // res.end('Hey from server')
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
  let ind = -1
  
  
  // console.log(clients)

  // History part here


  conn.on('message', message => {
    if(message.type === 'utf8'){
      
      if(!userName){
        userName = parseIt(message.utf8Data)
        userColor = randomMC.getColor()
        // clients.push({userName, userColor})
        // wsServer.broadcast(clients, JSON.stringify({type: 'notif', data: {notif: `${userName} has joined the conversation`, type: "+", color: userColor}}))
        wsServer.broadcast(clients, JSON.stringify({type: 'notif', data: {notif: `${userName} has joined the conversation`, type: "+"}}))
        ind = clients.push({userName, conn}) - 1
        conn.sendUTF(JSON.stringify({
          type: 'color',
          data: {
            userColor
          }
        }))
        // send clients list
        let peerList = clients.map(cl => cl.userName)
        console.log(peerList)
        wsServer.broadcast(clients, JSON.stringify({type: 'peer_list', data: {peers: JSON.stringify(peerList)}}))
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
        wsServer.broadcast(clients, jsonString)

      }
    }
  }) // on 'message'

  conn.on('close', connection => {
    if(userName && userColor){
      console.log(`${userName} has left the conversation`)
      clients.splice(ind, 1)
      wsServer.broadcast(clients, JSON.stringify({type: 'notif', data: {notif: `${userName} has left the conversation`, type: "-"}}))
    }
  })

}) // on 'request'

wsServer.__proto__.broadcast = (peersList, jsonMsg) => {
  for(let i of peersList){
    i.conn.sendUTF(jsonMsg)
  }
}

let parseIt = strin => {
  return strin.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}