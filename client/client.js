window.WebSocket = window.WebSocket || window.MozWebSocket

let conn = new WebSocket('ws://127.0.0.1:6900')
// let conn = new WebSocket('ws://young-lowlands-88811.herokuapp.com/')
// lett conn = new WebSocket('')

let contentDiv = document.getElementById('content')
let statusSpan = document.getElementById('status')
let inputField = document.getElementById('input')
let nameH1 = document.getElementById('Username')

let userName = false
let userColor = false

let allPeers = []

conn.onopen = () => {
  console.log('Connection accepted')
  statusSpan.textContent = 'Connected'
  inputField.removeAttribute('disabled')
  window.setTimeout(() => {
    statusSpan.parentElement.removeChild(statusSpan)
  }, 5500)

  // Notify the user that he/she is alone
  // if(allPeers.length){

  // }
}

conn.onerror = err => {
  console.log('Connection failed')
  console.error(err)
  statusSpan.textContent = 'Connection failed! Try reloading the page'
}

conn.onclose = ev => {
  console.log('Connection aborted')
  console.log(ev)
}

conn.onmessage = res => {
  // console.log(res) // Might be important
  let msg
  try{
    msg = JSON.parse(res.data)
  }
  catch(e){
    console.error('Invalid JSON recieved from server')
    console.error(e)
  }
  if(msg.type === 'color'){
    userColor = msg.data.userColor
    nameH1.style.display = 'block'
    nameH1.style.color = userColor
    nameH1.textContent = userName
  }
  else if(msg.type === 'notif'){
    // if(msg.data.)
    addNotif(msg.data)
  }
  else if(msg.type === 'peer_list'){
    allPeers = msg.data.peers
  }
  else if(msg.type === 'message'){
    addMessage(msg.data)
  }
}

inputField.addEventListener('keydown', ev => {
  // console.log(ev)
  if(ev.keyCode == 13){
    let val = ev.target.value
    if(val){
      conn.send(val)
      ev.target.value = ''
    }
    else
      return
    if(!userName){
      userName = val
    }
  }
})

let addNotif = data => {
  let outerDiv = document.createElement('div')
  switch (data.type){
    case '+':
      outerDiv.setAttribute('class', 'userMan')
      // outerDiv.innerHTML = `<span style="color: ${data.color}">${data.user}</span><span>${data.notif}</span>`
      outerDiv.innerHTML = `<span class="addUser">${data.notif}</span>`
      break
    case '-':
      outerDiv.setAttribute('class', 'userMan')
      outerDiv.innerHTML = `<span class="removeUser">${data.notif}</span>`
      break
  }
  contentDiv.appendChild(outerDiv)
}

let addMessage = msg => {
  console.log(msg)
  let outerDiv = document.createElement('div')
  if(msg.userName === userName){
    outerDiv.setAttribute('class', 'mess mine')
  }
  else{
    outerDiv.setAttribute('class', 'mess notmine')
  }
  outerDiv.innerHTML = `<p style="color: ${msg.userColor};">${msg.userName}</p>
    <p>${msg.data}</p>
  `
  contentDiv.appendChild(outerDiv)
}