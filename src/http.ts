import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { routes } from './routes';
import path from 'path';
import './database';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (request, response) => {
  return response.render('html/client.html');
});

const http = createServer(app); // creating http protocol
const io = new Server(http); // creating ws protocol

io.on('connection', (socket: Socket) => {
  console.log('Connected', socket.id);
});

app.use(express.json());

app.use(routes);

export { http, io };