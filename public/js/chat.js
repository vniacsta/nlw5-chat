onLoad();

let socket_admin_id = null;
let emailUser = null;
let socket = null;

const chat = document.getElementById('chatHelp');
const chatInSupport = document.getElementById('chatInSupport');
const btnSupport = document.getElementById('btnSupport');
const messagesBox = document.getElementById('messages');
const templateClient = document.getElementById('messageUserTemplate').innerHTML;
const templateAdmin = document.getElementById('adminTemplate').innerHTML;

function onLoad() {
  fetch('http://localhost:3333/settings/admin').then((result) =>
    result.json().then((response) => {
      if (!response.chat) {
        btnSupport.style.display = 'none';
      }
    })
  );
}

function openChat() {
  chat.style.display = 'block';
  btnSupport.style.display = 'none';
}

function closeChat() {
  chat.style.display = 'none';
  chatInSupport.style.display = 'none';
  btnSupport.style.display = 'flex';
}

function keyUpTextHelp(event) {
  const characRemaining = document.getElementById('characRemaining');
  const lengthText = event.target.value.length;
  characRemaining.innerHTML = Number(250) - Number(lengthText);
}

document.querySelector('#startChat').addEventListener('click', (event) => {
  socket = io();

  const chatHelp = document.getElementById('chatHelp');
  chatHelp.style.display = 'none';

  const chatInSupport = document.getElementById('chatInSupport');
  chatInSupport.style.display = 'block';

  const email = document.getElementById('email').value;
  emailUser = email;

  const text = document.getElementById('txtHelp').value;

  socket.on('connect', () => {
    const params = {
      email,
      text,
    };

    socket.emit('client_first_access', params, (call, err) => {
      if (err) {
        console.err(err);
      } else {
        console.log(call);
      }
    });
  });

  socket.on('client_list_all_messages', (messages) => {
    messages.forEach((message) => {
      if (message.admin_id === null) {
        const rendered = Mustache.render(templateClient, {
          message: message.text,
          email,
        });

        messagesBox.innerHTML += rendered;
      } else {
        const rendered = Mustache.render(templateAdmin, {
          message_admin: message.text,
        });

        messagesBox.innerHTML += rendered;
      }
    });
  });

  socket.on('admin_send_to_client', (message) => {
    socket_admin_id = message.socket_id;

    const rendered = Mustache.render(templateAdmin, {
      message_admin: message.text,
    });

    messagesBox.innerHTML += rendered;
  });
});

document.querySelector('#btnSendMessage').addEventListener('click', (event) => {
  const text = document.getElementById('messageUser');

  const params = {
    text: text.value,
    socket_admin_id,
  };

  socket.emit('client_send_to_admin', params);

  const rendered = Mustache.render(templateClient, {
    message: text.value,
    email: emailUser,
  });

  messagesBox.innerHTML += rendered;

  text.value = '';
});
