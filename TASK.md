# Real-time Chat Application

Build a real-time chat app with the following requirements:

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Real-time**: Socket.IO

## Features
1. User enters a username to join chat
2. Real-time messaging via Socket.IO broadcast
3. Message bubbles with sender name, timestamp, message text
4. Typing indicator with animated dots
5. Online users list showing connected participants
6. Responsive design (mobile + desktop)
7. Dark theme with purple/indigo gradients, glassmorphism, animations
8. In-memory messages (no database)

## Project Structure
```
chat-app/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── UserList.jsx
│   │   │   └── JoinForm.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
├── server/              # Express backend
│   ├── index.js
│   └── package.json
└── package.json         # Root
```

## Design Requirements
- Dark theme with purple/indigo gradient accents
- Smooth message appear animations (slide-in)
- Glassmorphism effect for chat container
- Custom scrollbar styling
- Typing indicator with animated dots
- User avatars with colored circles and initials
