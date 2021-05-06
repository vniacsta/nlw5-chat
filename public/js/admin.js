const socket = io();
let connectionsUsers = [];

const listUsers = document.getElementById('listUsers');
const template = document.getElementById('template').innerHTML;
const templateAdmin = document.getElementById('adminTemplate').innerHTML;
const supports = document.getElementById('supports');

socket.on('admin_list_all_users', (connections) => {
  connectionsUsers = connections;

  listUsers.innerHTML = '';

  connections.forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });

    listUsers.innerHTML += rendered;
  });
});

function call(id) {
  const connection = connectionsUsers.find(
    (connection) => connection.socket_id === id
  );

  const rendered = Mustache.render(templateAdmin, {
    email: connection.user.email,
    id: connection.user_id,
  });

  supports.innerHTML += rendered;

  const params = {
    user_id: connection.user_id,
  };

  socket.emit('admin_user_in_support', params);

  socket.emit('admin_list_messages_by_user', params, (messages) => {
    const divMessages = document.getElementById(
      `allMessages${connection.user_id}`
    );

    messages.forEach((message) => {
      const createDiv = document.createElement('div');

      if (message.admin_id === null) {
        createDiv.className = 'admin-message-client';
        createDiv.innerHTML = `<span></span>`;
        createDiv.innerHTML += `<span>${message.text}</span>`;
        createDiv.innerHTML += `<span class='user-date'>${dayjs(
          message.created_at
        ).format('DD/MM/YYYY HH:mm:ss')} <strong>${
          connection.user.email
        }</strong></span>`;
      } else {
        createDiv.className = 'admin-message-admin';
        createDiv.innerHTML = `<span>${message.text}</span>`;
        createDiv.innerHTML += `<span class='user-date'>${dayjs(
          message.created_at
        ).format('DD/MM/YYYY HH:mm:ss')} <strong>Admin</strong></span>`;
      }

      divMessages.appendChild(createDiv);
    });
  });
}

function sendMessage(id) {
  const text = document.getElementById(`sendMessage${id}`);

  const params = {
    text: text.value,
    user_id: id,
  };

  socket.emit('admin_send_message', params);

  const divMessages = document.getElementById(`allMessages${id}`);

  const createDiv = document.createElement('div');
  createDiv.className = 'admin-message-admin';
  createDiv.innerHTML = `<span>${params.text}</span>`;
  createDiv.innerHTML += `<span class='admin-date'>${dayjs().format(
    'DD/MM/YYYY HH:mm:ss'
  )} <strong>Admin</strong></span>`;

  divMessages.appendChild(createDiv);

  text.value = '';
}

socket.on('admin_receive_message', (data) => {
  console.log(data);
  const divMessages = document.getElementById(
    `allMessages${data.message.user_id}`
  );

  const createDiv = document.createElement('div');
  createDiv.className = 'admin-message-client';
  createDiv.innerHTML += `<span>${data.message.text}</span>`;
  createDiv.innerHTML += `<span class='user-date'>${dayjs(
    data.message.created_at
  ).format('DD/MM/YYYY HH:mm:ss')} <strong>${data.email}</strong></span>`;

  divMessages.appendChild(createDiv);
});
