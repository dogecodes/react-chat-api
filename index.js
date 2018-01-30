const express = require('express');
const http = require('http');
// const socketio = require('socket.io');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const socketio = require('./middlewares/socketio');

const app = express();

// Create servers
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Open MongoDB connection
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/dogecodes-react-chat', {
  useMongoClient: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Database connection error:', error)
});

db.once('open', () => {
  console.log('Database connected');
});

// WebSocket Handlers

// wss.on('connection', (ws, req) => {
//   ws.on('message', (message) => {
//     console.log('received: %s', message);
//     ws.send('response');
//   });
// });

// wss.broadcast = (data) => {
//   console.log(`WebSocket Server has ${wss.clients.length} clients`);

//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(data));
//       console.log(`WebSocket message has been sent: ${data}`);
//     } else {
//       console.log('WebSocket was not open!');
//     }
//   });
// };

// Use url body parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add socket.io

// app.use(socketio(io))

// Use routers

app.use('/', routes);

// Start listening

server.listen(8000, () => {
  console.log(`Listening on ${server.address().port}`);
});
