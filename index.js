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

  // 1. Join Private Room (For active chat screen)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // 2. Register Personal User Email Room (For global notifications)
  socket.on('registerUser', (email) => {
    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      socket.join(cleanEmail);
      console.log(`Socket ${socket.id} registered user room: ${cleanEmail}`);
    }
  });

  // 3. Private Message
  socket.on('privateMessage', (data) => {
    console.log('Private Message:', data);
    if (data && data.roomId) {
      // Send to active chat room
      io.to(data.roomId).emit('message', data);

      // Send to receiver's personal user room for global background notification
      if (data.receiverEmail) {
        const cleanReceiver = data.receiverEmail.toLowerCase().trim();
        io.to(cleanReceiver).emit('notificationMessage', data);
      }
    }
  });

  // 4. Global Broadcast Message (Fallback)
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
