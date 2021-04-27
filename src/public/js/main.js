const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const {username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});


const socket = io();


// JOIN Chatroom
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
});


// Message from server
socket.on('message', message => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get Message text
  const msg = e.target.elements.msg.value;

  // console.log(msg);

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to Dom
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;

  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to Doom
function outputRoomName(room){
  roomName.innerText = room;

}

// add users to Dom
function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user=> `<li>${user.username}</li>`).join('')}

  `
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  window.location = '../index.html';
});
