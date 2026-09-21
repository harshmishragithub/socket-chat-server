const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable CORS for Flutter Client
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.get('/', (req, res) => {
  res.send('Socket.IO Chat Server is Live & Running!');
});

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  // Message Receive karke Sabhi Users ko Send (Broadcast) karein
  socket.on('message', (data) => {
    console.log('Message:', data);
    io.emit('message', data); // Broadcast to everyone
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
