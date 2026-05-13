# Real-Time Chat App

A modern real-time chat application built with React (Vite), Tailwind CSS, Node.js Express, and Socket.IO.

## Features

- **Username Join**: Simple join form to enter the chat
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Typing Indicator**: See when other users are typing
- **Online Users List**: View all currently connected users
- **Responsive Design**: Works on mobile and desktop
- **Dark Theme**: Beautiful purple/indigo gradients with glassmorphism effects

## Project Structure

```
/workspace
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatRoom.jsx    # Main chat interface
│   │   │   ├── JoinForm.jsx    # Username entry form
│   │   │   ├── Message.jsx     # Individual message component
│   │   │   └── UserList.jsx    # Online users sidebar
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles + Tailwind
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── server/                 # Node.js backend
    ├── index.js            # Express + Socket.IO server
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js 18+ installed

### Backend Setup

```bash
cd /workspace/server
npm install
npm start
```

The server will run on `http://localhost:3001`

### Frontend Setup

```bash
cd /workspace/client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Start both the server and client
2. Open `http://localhost:5173` in your browser
3. Enter a username and click "Join Chat"
4. Start chatting! Open multiple browser tabs to simulate multiple users

## Technical Details

### Backend (Server)
- **Express**: HTTP server framework
- **Socket.IO**: Real-time bidirectional communication
- **In-memory storage**: Messages stored in array (last 100 messages kept)
- **CORS enabled**: Allows frontend connection from localhost:5173

### Frontend (Client)
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Socket.IO Client**: Real-time communication
- **Glassmorphism**: Backdrop blur effects with semi-transparent backgrounds

### Socket Events

**Client → Server:**
- `join`: User joins with username
- `send_message`: Send a chat message
- `typing`: User started typing
- `stop_typing`: User stopped typing

**Server → Client:**
- `chat_history`: Previous messages on join
- `receive_message`: New message received
- `system_message`: System notification (user joined/left)
- `user_list`: Updated online users list
- `user_typing`: User started typing indicator
- `user_stop_typing`: User stopped typing indicator

## Styling

The app features a beautiful dark theme with:
- Purple to indigo gradient backgrounds
- Glassmorphism cards with backdrop blur
- Smooth animations and transitions
- Responsive layout (sidebar hidden on mobile)
- Custom scrollbar styling
