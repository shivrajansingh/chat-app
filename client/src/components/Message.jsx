function Message({ message, isOwn }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // System message styling
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] md:max-w-[65%] ${isOwn ? 'order-1' : 'order-2'}`}>
        {/* Username and timestamp */}
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1 ml-1">
            <span className="text-xs font-semibold text-purple-300">{message.username}</span>
            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          </div>
        )}
        
        {/* Message bubble with glassmorphism */}
        <div
          className={`px-4 py-2.5 rounded-2xl backdrop-blur-sm border ${
            isOwn
              ? 'bg-gradient-to-br from-purple-600/80 to-indigo-600/80 border-purple-400/30 text-white rounded-br-md'
              : 'bg-white/10 border-white/20 text-gray-100 rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message.text}</p>
        </div>
        
        {/* Timestamp for own messages */}
        {isOwn && (
          <div className="flex justify-end mt-1 mr-1">
            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
