const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

let name;
if (!name) {
  name = prompt('What is your name?');
  if (name) {
    appendMyMessage('You joined');
    socket.emit('new-user', name);
  }
}

socket.on('connect', () => {
  console.log('Connected with socket ID:', socket.id);
});

socket.on('first-user', isFirstUser => {
  if (isFirstUser) {
    console.log("Welcome! You are the first user in the chat.", socket.id);
    const answer = prompt('What is the name of the movie?');
    socket.emit('question-answered', answer); // sends the answer to the server
  }
});

socket.on('chat-message', data => {
  appendForeignMessage(`${data.name} (${data.id}): ${data.message}`);
});

socket.on('user-connected', userName => {
  appendForeignMessage(`${userName} connected`);
});

socket.on('user-disconnected', userName => {
  appendForeignMessage(`${userName} disconnected`);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  if (message.trim()) {
    appendMyMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  }
});

function appendMyMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'my-message');
  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');
  bubble.innerText = message;
  messageElement.append(bubble);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function appendForeignMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'foreign-message');
  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');
  bubble.innerText = message;
  messageElement.append(bubble);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
