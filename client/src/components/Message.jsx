function Message({ message, isOwn }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // System message styling
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <span className="text-xs font-medium text-gray-400 bg-gradient-to-r from-purple-500/10 via-white/5 to-indigo-500/10 px-4 py-2 rounded-full border border-white/10 shadow-lg backdrop-blur-sm">
          <span className="inline-flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message.text}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group animate-fade-in`}>
      <div className={`max-w-[80%] md:max-w-[70%] lg:max-w-[65%] flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white/10">
              {message.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} min-w-0`}>
          {/* Username and timestamp */}
          {!isOwn && (
            <div className="flex items-center gap-2 mb-1 ml-1">
              <span className="text-xs font-semibold text-cyan-300">{message.username}</span>
            </div>
          )}
          
          {/* Message bubble with glassmorphism */}
          <div
            className={`px-4 py-3 rounded-2xl backdrop-blur-md border shadow-lg transition-all duration-200 hover:shadow-xl ${
              isOwn
                ? 'bg-gradient-to-br from-purple-600/90 via-purple-600/80 to-indigo-600/90 border-purple-400/30 text-white rounded-br-md hover:border-purple-400/50'
                : 'bg-white/15 border-white/20 text-gray-100 rounded-bl-md hover:bg-white/20 hover:border-white/30'
            }`}
          >
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.text}</p>
          </div>
          
          {/* Timestamp */}
          <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'mr-1 flex-row-reverse' : 'ml-1'}`}>
            <span className="text-xs text-gray-500 font-medium">{formatTime(message.timestamp)}</span>
            {isOwn && (
              <svg className="w-3 h-3 text-purple-400/60" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
            )}
          </div>
        </div>

        {/* Own avatar */}
        {isOwn && (
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-white/10">
              {message.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
