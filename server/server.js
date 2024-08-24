const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', require('./routes/userRoutes'));
app.use('/api/v1/post', require('./routes/postRoutes'));
app.use('/api/v1/chat', require('./routes/chatRoutes'));

io.on('connection', (socket) => {
//   console.log('New client connected');

  socket.on('message', (message) => {
    io.emit('message', message); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
