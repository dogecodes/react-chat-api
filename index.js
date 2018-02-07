const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const SocketIOServer = require('socket.io');
const routes = require('./routes');
const socketio = require('./middlewares/socketio');
const { MONGODB_URI } = require('./config');

const app = express();

// Create servers
const server = http.createServer(app);
const io = SocketIOServer(server);

// Open MongoDB connection
mongoose.Promise = Promise;

mongoose.connect(MONGODB_URI, {
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

// Allow CORS

app.use(cors());

// Add socket.io

app.use(socketio(io))

// Use routers

app.use('/', routes);

// Start listening

server.listen(8000, () => {
  console.log(`Listening on ${server.address().port}`);
});
