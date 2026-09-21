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

  // 1. Join Private Room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // 2. Private Message (Sends ONLY to people inside that roomId)
  socket.on('privateMessage', (data) => {
    console.log('Private Message:', data);
    if (data && data.roomId) {
      io.to(data.roomId).emit('message', data);
    }
  });

  // 3. Global Broadcast Message (Fallback / Global Chat)
  socket.on('message', (data) => {
    console.log('Global Message:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
