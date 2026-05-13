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

    // Listen for typing indicators
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
      {/* Animated background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="backdrop-blur-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-b border-white/20 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-white/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Chat Room</h1>
              <p className="text-xs text-gray-300">Logged in as <span className="text-purple-300 font-semibold">{username}</span></p>
            </div>
          </div>
          <button
            onClick={onLeave}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-gray-300 hover:text-white transition-all duration-200 text-sm font-semibold backdrop-blur-sm border border-white/10 hover:border-red-400/50"
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
            className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* User list sidebar */}
        <div className={`fixed lg:static top-0 right-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-50 lg:transform-none lg:w-72 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}>
          <div className="h-full pt-20 lg:pt-0 pr-0 lg:pr-4">
            <UserList users={onlineUsers} currentUser={username} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col backdrop-blur-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 font-medium">No messages yet</p>
                  <p className="text-gray-500 text-sm mt-1">Start the conversation!</p>
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
              <div className="mt-3 ml-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                  <span className="text-xs text-gray-400 italic font-medium">
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form onSubmit={sendMessage} className="border-t border-white/10 p-4 bg-gradient-to-r from-white/5 via-transparent to-white/5 backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-200"
                  maxLength={500}
                />
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-purple-500/30 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile user count badge */}
      <div className={`lg:hidden fixed bottom-24 right-4 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 backdrop-blur-sm text-white text-xs font-bold shadow-lg transition-all duration-200 ${
        isSidebarOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
      }`}>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          {onlineUsers.length} online
        </span>
      </div>
    </div>
  );
}

export default ChatRoom;
