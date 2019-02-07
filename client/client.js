window.WebSocket = window.WebSocket || window.MozWebSocket

let conn = new WebSocket('ws://127.0.0.1:6900')
let statusSpan = document.getElementById('status')
let inputField = document.getElementById('input')
let nameH1 = document.getElementById('Username')

let userName = false
let userColor = false

conn.onopen = () => {
  console.log('Connection accepted')
  statusSpan.textContent = 'Connected'
  inputField.removeAttribute('disabled')
  window.setTimeout(() => {
    statusSpan.parentElement.removeChild(statusSpan)
  }, 2500)
}

conn.onerror = err => {
  console.log('Connection failed')
  console.error(err)
  statusSpan.textContent = 'Connection failed! Try reloading the page'
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