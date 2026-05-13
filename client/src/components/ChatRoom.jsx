import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Message from './Message';
import UserList from './UserList';

const SOCKET_URL = 'http://localhost:3001';

function ChatRoom({ username, onLeave }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingUsersRef = useRef([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Join chat
    newSocket.emit('join', username);

    // Listen for chat history
    newSocket.on('chat_history', (history) => {
      setMessages(history);
    });

    // Listen for new messages
    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for system messages
    newSocket.on('system_message', (text) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), type: 'system', text, timestamp: new Date().toISOString() },
      ]);
    });

    // Listen for user list updates
    newSocket.on('user_list', (users) => {
      setOnlineUsers(users);
    });

    // Listen for typing indicators - fix: only add if not already present
    newSocket.on('user_typing', ({ username: typingUser }) => {
      typingUsersRef.current = typingUsersRef.current.filter(u => u !== typingUser);
      typingUsersRef.current.push(typingUser);
      setTypingUsers([...typingUsersRef.current]);
      
      // Clear existing timeout and set new one
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        typingUsersRef.current = typingUsersRef.current.filter(u => u !== typingUser);
        setTypingUsers([...typingUsersRef.current]);
      }, 2000);
    });

    newSocket.on('user_stop_typing', ({ username: typingUser }) => {
      typingUsersRef.current = typingUsersRef.current.filter(u => u !== typingUser);
      setTypingUsers([...typingUsersRef.current]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!inputMessage) {
      socket?.emit('stop_typing');
      return;
    }

    socket?.emit('typing');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit('stop_typing');
    }, 2000);
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      socket.emit('send_message', { text: inputMessage.trim() });
      socket.emit('stop_typing');
      setInputMessage('');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Chat Room</h1>
              <p className="text-xs text-gray-400">Logged in as <span className="text-purple-300">{username}</span></p>
            </div>
          </div>
          <button
            onClick={onLeave}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            Leave Chat
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 flex gap-4 overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* User list sidebar - collapsible on mobile, always visible on desktop */}
        <div className={`fixed lg:static top-0 right-0 h-full w-72 transform transition-transform duration-300 ease-in-out z-50 lg:transform-none lg:w-64 lg:block ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}>
          <div className="h-full pt-20 lg:pt-0 pr-4">
            <UserList users={onlineUsers} currentUser={username} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    isOwn={message.username === username}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="mt-2 ml-1">
                <span className="text-xs text-gray-400 italic">
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </span>
              </div>
            )}
          </div>

          {/* Input area */}
          <form onSubmit={sendMessage} className="border-t border-white/10 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile user count badge - only show when sidebar is closed */}
      <div className={`lg:hidden fixed bottom-20 right-4 px-3 py-2 rounded-full bg-purple-600/80 backdrop-blur-sm text-white text-xs font-medium shadow-lg transition-opacity duration-200 ${
        isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        {onlineUsers.length} online
      </div>
    </div>
  );
}

export default ChatRoom;
