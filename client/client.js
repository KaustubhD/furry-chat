window.WebSocket = window.WebSocket || window.MozWebSocket

let conn = new WebSocket('ws://127.0.0.1:6900')
let statusSpan = document.getElementById('status')
let inputField = document.getElementById('input')

conn.onopen = () => {
  console.log('Connection accepted')
  statusSpan.textContent = 'Connected'
  inputField.removeAttribute('disabled')
  window.setTimeout(() => {
    statusSpan.parentElement.removeChild(statusSpan)
  }, 2500)
}

conn.onerror = (err) => {
  console.log('Connection failed')
  console.error(err)
  statusSpan.textContent = 'Connection failed! Try reloading the page'
}