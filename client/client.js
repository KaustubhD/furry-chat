// import "./client.css"
window.WebSocket = window.WebSocket || window.MozWebSocket

let conn = new WebSocket('ws://127.0.0.1:6900')
// let conn = new WebSocket('wss://young-lowlands-88811.herokuapp.com/')
// lett conn = new WebSocket('')
let leftDiv = document.querySelector('.left-div')
let rightDiv = document.querySelector('.right-div')
let contentDiv = document.getElementById('content')
let statusButton = document.getElementById('sub-name')
// let statusSpan = document.getElementById('status')
let inputField = document.querySelector('#input>input')
let nameH1 = document.getElementById('Username')

let userName = false
let userColor = false

let allPeers = []

let DEVICE_WIDTH = document.documentElement.clientWidth

setup()

conn.onopen = () => {
  // console.log('Connection accepted')
  // statusSpan.textContent = 'Connected'

  setStatus(true)

  inputField.removeAttribute('disabled')
  // window.setTimeout(() => {
  //   statusSpan.parentElement.removeChild(statusSpan)

  // }, 5500)

  // Notify the user that he/she is alone
  // if(allPeers.length){

  // }
}

conn.onerror = err => {
  // console.log('Connection failed')
  // console.error(err)

  setStatus(false, 'Connection failed')
  // statusSpan.textContent = 'Connection failed! Try reloading the page'
}

conn.onclose = ev => {
  // console.log('Connection aborted')
  // console.log(ev)
  setStatus(false, 'Connection aborted')
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
    //TODO: try making a listener
    allPeers = JSON.parse(msg.data.peers)
    allPeers.splice(allPeers.indexOf(userName), 1) // No need for my own name
    // console.log(allPeers)
    displayPeers(allPeers)
  }
  else if(msg.type === 'message'){
    addMessage(msg.data)
  }
}

document.getElementById('userName-input').addEventListener('keydown', keydownFunc)
document.getElementById('sub-name').addEventListener('click', keydownFunc)

inputField.addEventListener('keydown', keydownFunc)
// inputField.addEventListener('keydown', ev => {
//   if(ev.keyCode == 13){
//     let val = ev.target.value
//     if(val){
//       conn.send(val)
//       ev.target.value = ''
//     }
//     else
//       return
//     if(!userName){
//       userName = val
//     }
//   }
// })

let addNotif = data => {
  let outerDiv = document.createElement('div')
  switch (data.type){
    case '+':
      outerDiv.setAttribute('class', 'userMan addUser')
      // outerDiv.innerHTML = `<span style="color: ${data.color}">${data.user}</span><span>${data.notif}</span>`
      outerDiv.innerHTML = `<span>${data.notif}</span>`
      break
    case '-':
      outerDiv.setAttribute('class', 'userMan removeUser')
      outerDiv.innerHTML = `<span>${data.notif}</span>`
      break
  }
  contentDiv.appendChild(outerDiv)
}

let addMessage = msg => {
  // console.log(msg)
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
  contentDiv.scrollTop = contentDiv.scrollHeight
}

function displayPeers(list){
  let peersDiv = document.querySelector('#peers>ul')
  peersDiv.innerHTML = list.reduce((acc, peer) => acc + `<li>${peer}</li>`, '')
}

function keydownFunc(ev){
  // console.log('%cLog keydown event', 'background: #007277; color: #ddd;')
  // console.log(`User name is ${userName}`)
  // console.log(ev)
  if((ev.type === "keydown" && ev.keyCode == 13) || ev.type==="click"){
    let element = ev.type === "keydown" ? ev.target : ev.target.previousElementSibling
    let elementVal = element.value
    if(elementVal){
      conn.send(elementVal)
      element.value = ''
    }
    else
      return
    if(!userName){
      // console.log(`%cIn not username --- ${elementVal}`, 'color: #0ff')
      userName = elementVal
      element.removeEventListener('keydown', keydownFunc)
      this.removeEventListener('click', keydownFunc)
      closeOverlay()
    }
  }
}

function closeOverlay(){
  let overlay = document.getElementById('overlay')
  overlay.classList.add('close-over')
  overlay.addEventListener('transitionend', ev => {
    // console.log('Transition end')
    overlay.parentElement.removeChild(overlay)
  })

}

function setup(){
  setStatus(false)
  window.addEventListener('orientationchange', calcVh)
  window.addEventListener('resize', calcVh)
  calcVh()
}


function setStatus(isActive, msg){
  // console.log(`%ccalled status with ${isActive}`, 'background-color: #05e')
  let statusButton = document.getElementById('sub-name')
  if(statusButton){
    if(!isActive){
      if(msg)
        statusButton.innerText = msg
      else
        statusButton.innerText = "Connecting..."
      statusButton.parentElement.querySelectorAll('input, button').forEach(el => {
        el.setAttribute('disabled', true)
        el.classList.add('disabled')
      })
    }
    else{
      // console.log('In here')
      statusButton.innerText = "Enter chat"
      statusButton.parentElement.querySelectorAll('input, button').forEach(el => {
        el.removeAttribute('disabled')
        el.classList.remove('disabled')
      })
    }
  }
}

function calcVh(){
  let maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  DEVICE_WIDTH = document.documentElement.clientWidth
  document.documentElement.style.height = `${maxHeight}px`
}


// Touch events

// Globals
let T_start = 0
let T_end = 0
let isValidSwipe = false
let swipeDir = 0
let acceptablePercent = 75
let draggableDiv = leftDiv
let animationFrame

rightDiv.addEventListener('touchstart', startTouch, {passive: true})
rightDiv.addEventListener('touchmove', moveTouch)
rightDiv.addEventListener('touchend', endTouch, {passive: true})

function startTouch(ev){
  console.log(`%cStarting touch`, 'background-color: #004800; color: #fff;')
  console.log(ev)
  T_start = ev.changedTouches[0].clientX
  isValidSwipe = true ? T_start < 20 : false
}
function moveTouch(ev){
  ev.preventDefault()
  // console.log(`%cMoving touch`, 'background-color: #A73838; color: #fff;')
  // console.log(ev)
  console.log('SwipeDir ---' + swipeDir)
  if(isValidSwipe || draggableDiv.className.split(' ').indexOf('visible') >= 0){
    swipeDir = ev.changedTouches[0].clientX - T_start
    T_end = -100 + (swipeDir * 100 / draggableDiv.clientWidth)
    requestAnimationFrame(function(){
      draggableDiv.style.transform = `translate3d(${T_end}%,0,0)`
    })
  }
  console.log(100 + T_end)
}
function endTouch(ev){
  console.log(`%cEnding touch`, 'background-color: #0E2F44; color: #fff;')
  console.log(ev)
  console.log(100 + T_end)
  if(100 + T_end >= acceptablePercent){
    console.log(swipeDir)
    // debugger
    animationFrame = requestAnimationFrame(() => {animTill(T_end, 0)})
    draggableDiv.classList.add('visible')
  }
  else{
    animationFrame = requestAnimationFrame(() => {animTill(T_end, -100)})
    draggableDiv.classList.remove('visible')
  }
}

let diff
function animTill(current, limit){
  console.log(current + " ---- " + limit)
  // debugger
  diff = limit - current
  if(Math.abs(diff) <= 1 || Math.abs(diff) >= 99){
    cancelAnimationFrame(animationFrame)
    diff = 0
    T_start = 0
    T_end = 0
    isValidSwipe = false
    swipeDir = 0
    return
  }
  current += Math.sign(diff) * 2
  draggableDiv.style.transform = `translate3d(${current}%,0,0)`
  animationFrame = requestAnimationFrame(() => {animTill(current, limit)})

  // if(current > limit){

  // }
  //   while(current > limit){
  //     current -= 4
  //     requestAnimationFrame()
  //   }
  // // }
  // else{
  //   while(current < limit){
  //     current += 4
  //     requestAnimationFrame()
  //   }
  // }
  // cancelAnimationFrame(animationFrame)
}