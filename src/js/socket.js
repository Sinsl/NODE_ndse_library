const roomName = location.pathname.split('/').pop()
const socket = io.connect('/', {query: `roomName=${roomName}`})
const arrMessage = Array.from(document.querySelectorAll('.received'))
const messages = document.querySelector('.messages')

if (document.querySelector('.message-send-auth')) {

  const loginForm = document.querySelector('.login-form')
  const registerForm = document.querySelector('.register-form')
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginForm.current_url.value = window.location.href;
    loginForm.submit();
  })

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    registerForm.current_url.value = window.location.href;
    registerForm.submit();
  })

}

socket.on('message-book', ( objMessage) => {
  const newElem = createElementMessage(objMessage)
  fetch('/user/current')
  .then(response => response.json())
  .then(user => {
      if (objMessage.userId === user.id) {
        newElem.classList.add('dispatched')
      }
  })
  .catch(error => console.log(error))
  .finally(() => messages.append(newElem))
})

const form = document.querySelector('.message-send')
if (form) {
  const userid = form.querySelector('p').dataset.userid
  fetch('/user/current')
  .then(response => response.json())
  .then(user => {
    arrMessage.forEach(item => {
      if (item.dataset.userid === user.id) {
        item.classList.add('dispatched')
      }
    })
  })
  .catch(error => console.log(error))
  sendMessage(userid)
}

function sendMessage(id) {
  const userName = form.querySelector('p').textContent
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const date = new Date()
    const objMessage = {
      textMessage: form.story.value,
      userId: id,
      userName,
      datetime: date.toLocaleString()
    }
    saveMessageBD(objMessage)
    socket.emit('message-book', objMessage)
    form.reset();
  })
}

async function saveMessageBD(data) {
  console.log('сохраняем в БД')
  await fetch(`/api/books/${roomName}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({textMessage: data.textMessage, datetime: data.datetime})
  })
}

function createElementMessage(data) {
  const divMessage = document.createElement('div')
  divMessage.classList.add('received')
  divMessage.dataset.userid = data.userId
  divMessage.insertAdjacentHTML('beforeend', 
  `<div class="message-header">
    <span class="message-date">${data.datetime}</span>
    <span class="message-name">${data.userName}</span>
  </div>
  <div class="message-text">
    <p>${data.textMessage}</p>
  </div>`
  )
  return divMessage
}



