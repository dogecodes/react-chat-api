const express = require('express');
const http = require('http');
const SocketIOServer = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const socketio = require('./middlewares/socketio');

const app = express();

// Create servers
const server = http.createServer(app);
const io = SocketIOServer(server);

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

// Use url body parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add socket.io

app.use(socketio(io))

io.on('connection', socket => {
  socket.send('test')
  socket.on('message', console.log)
});

// Use routers

app.use('/', routes);

// Start listening

server.listen(8000, () => {
  console.log(`Listening on ${server.address().port}`);
});
