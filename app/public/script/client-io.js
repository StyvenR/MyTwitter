const socket = io("http://localhost:8080");
let socketId = null;
let userId = getCookie("userId");
console.log('User ID from cookie:', userId);

socket.on('connect', () => {
    socketId = socket.id;
    console.log('Connected to server');
});

socket.on('message', (message) => {
    broadcast(message);
    console.log('Message received: ', message);
});

const messagechatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');

messagechatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();
    console.log('Message sent: ', message);
    if (message === '') {
        return;
    }
    send(message);
    messageInput.value = '';
    messageInput.focus();
});

const send = function (message) {
    const completeMessage = {
        userId: userId,
        text: message,
        timestamp: new Date().toISOString()
    };
    socket.emit('message', completeMessage);
}

const broadcast = function (message) {
    var messageList = document.getElementById('messageList');
    var li = document.createElement('li');
    li.innerHTML = `<strong>${message.userId}</strong> [${new Date(message.timestamp).toLocaleTimeString()}]: ${message.text.text}`;
    messageList.appendChild(li);
    console.log('Message broadcasted: ', message);
}

function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}


