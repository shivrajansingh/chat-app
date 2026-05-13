const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// In-memory storage
const messages = [];
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins with username
  socket.on('join', (username) => {
    socket.username = username;
    onlineUsers.set(socket.id, username);
    
    // Send current messages to new user
    socket.emit('chat_history', messages);
    
    // Broadcast updated user list
    io.emit('user_list', Array.from(onlineUsers.values()));
    
    // Announce user joined
    socket.broadcast.emit('system_message', `${username} joined the chat`);
  });

  // Handle chat messages
  socket.on('send_message', (data) => {
    const message = {
      id: Date.now(),
      username: socket.username,
      text: data.text,
      timestamp: new Date().toISOString(),
    };
    
    messages.push(message);
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages.shift();
    }
    
    io.emit('receive_message', message);
  });

  // Typing indicator
  socket.on('typing', () => {
    socket.broadcast.emit('user_typing', { username: socket.username });
  });

  socket.on('stop_typing', () => {
    socket.broadcast.emit('user_stop_typing', { username: socket.username });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.username) {
      onlineUsers.delete(socket.id);
      io.emit('user_list', Array.from(onlineUsers.values()));
      io.emit('system_message', `${socket.username} left the chat`);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
