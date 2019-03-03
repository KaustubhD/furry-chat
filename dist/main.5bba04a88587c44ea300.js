/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/client.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/client.js":
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("window.WebSocket = window.WebSocket || window.MozWebSocket; // let conn = new WebSocket('ws://127.0.0.1:6900')\n\nlet conn = new WebSocket('wss://young-lowlands-88811.herokuapp.com/'); // lett conn = new WebSocket('')\n\nlet contentDiv = document.getElementById('content');\nlet statusSpan = document.getElementById('status');\nlet inputField = document.querySelector('#input>input');\nlet nameH1 = document.getElementById('Username');\nlet userName = false;\nlet userColor = false;\nlet allPeers = [];\n\nconn.onopen = () => {\n  console.log('Connection accepted');\n  statusSpan.textContent = 'Connected';\n  inputField.removeAttribute('disabled');\n  window.setTimeout(() => {\n    statusSpan.parentElement.removeChild(statusSpan);\n  }, 5500); // Notify the user that he/she is alone\n  // if(allPeers.length){\n  // }\n};\n\nconn.onerror = err => {\n  console.log('Connection failed');\n  console.error(err);\n  statusSpan.textContent = 'Connection failed! Try reloading the page';\n};\n\nconn.onclose = ev => {\n  console.log('Connection aborted');\n  console.log(ev);\n};\n\nconn.onmessage = res => {\n  // console.log(res) // Might be important\n  let msg;\n\n  try {\n    msg = JSON.parse(res.data);\n  } catch (e) {\n    console.error('Invalid JSON recieved from server');\n    console.error(e);\n  }\n\n  if (msg.type === 'color') {\n    userColor = msg.data.userColor;\n    nameH1.style.display = 'block';\n    nameH1.style.color = userColor;\n    nameH1.textContent = userName;\n  } else if (msg.type === 'notif') {\n    // if(msg.data.)\n    addNotif(msg.data);\n  } else if (msg.type === 'peer_list') {\n    //TODO: try making a listener\n    allPeers = JSON.parse(msg.data.peers);\n    allPeers.splice(allPeers.indexOf(userName), 1); // No need for my own name\n\n    console.log(allPeers);\n    displayPeers(allPeers);\n  } else if (msg.type === 'message') {\n    addMessage(msg.data);\n  }\n};\n\ndocument.getElementById('userName-input').addEventListener('keydown', keydownFunc);\ndocument.getElementById('sub-name').addEventListener('click', keydownFunc);\ninputField.addEventListener('keydown', keydownFunc); // inputField.addEventListener('keydown', ev => {\n//   if(ev.keyCode == 13){\n//     let val = ev.target.value\n//     if(val){\n//       conn.send(val)\n//       ev.target.value = ''\n//     }\n//     else\n//       return\n//     if(!userName){\n//       userName = val\n//     }\n//   }\n// })\n\nlet addNotif = data => {\n  let outerDiv = document.createElement('div');\n\n  switch (data.type) {\n    case '+':\n      outerDiv.setAttribute('class', 'userMan addUser'); // outerDiv.innerHTML = `<span style=\"color: ${data.color}\">${data.user}</span><span>${data.notif}</span>`\n\n      outerDiv.innerHTML = `<span>${data.notif}</span>`;\n      break;\n\n    case '-':\n      outerDiv.setAttribute('class', 'userMan removeUser');\n      outerDiv.innerHTML = `<span>${data.notif}</span>`;\n      break;\n  }\n\n  contentDiv.appendChild(outerDiv);\n};\n\nlet addMessage = msg => {\n  console.log(msg);\n  let outerDiv = document.createElement('div');\n\n  if (msg.userName === userName) {\n    outerDiv.setAttribute('class', 'mess mine');\n  } else {\n    outerDiv.setAttribute('class', 'mess notmine');\n  }\n\n  outerDiv.innerHTML = `<p style=\"color: ${msg.userColor};\">${msg.userName}</p>\n    <p>${msg.data}</p>\n  `;\n  contentDiv.appendChild(outerDiv);\n  contentDiv.scrollTop = contentDiv.scrollHeight;\n};\n\nfunction displayPeers(list) {\n  let peersDiv = document.querySelector('#peers>ul');\n  peersDiv.innerHTML = list.reduce((acc, peer) => acc + `<li>${peer}</li>`, '');\n}\n\nfunction keydownFunc(ev) {\n  console.log('%cLog keydown event', 'background: #007277; color: #ddd;');\n  console.log(`User name is ${userName}`);\n  console.log(ev);\n\n  if (ev.type === \"keydown\" && ev.keyCode == 13 || ev.type === \"click\") {\n    let element = ev.type === \"keydown\" ? ev.target : ev.target.previousElementSibling;\n    let elementVal = element.value;\n\n    if (elementVal) {\n      conn.send(elementVal);\n      element.value = '';\n    } else return;\n\n    if (!userName) {\n      console.log(`%cIn not username --- ${elementVal}`, 'color: #0ff');\n      userName = elementVal;\n      element.removeEventListener('keydown', keydownFunc);\n      this.removeEventListener('click', keydownFunc);\n      closeOverlay();\n    }\n  }\n}\n\nfunction closeOverlay() {\n  let overlay = document.getElementById('overlay');\n  overlay.classList.add('close-over');\n  overlay.addEventListener('transitionend', ev => {\n    console.log('Transition end');\n    overlay.parentElement.removeChild(overlay);\n  });\n}\n\n//# sourceURL=webpack:///./client/client.js?");

/***/ })

/******/ });