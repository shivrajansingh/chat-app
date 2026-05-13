import { useState } from 'react';

function JoinForm({ onJoin }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      // Simulate a brief loading state for better UX
      setTimeout(() => {
        onJoin(username.trim());
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Glassmorphism card with enhanced effects */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-purple-500/20 hover:border-white/30">
          {/* Header with gradient */}
          <div className="text-center mb-8">
            {/* Animated logo container */}
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 shadow-2xl relative group">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md group-hover:blur-lg transition-all duration-300"></div>
              <svg
                className="w-12 h-12 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome to Chat</h1>
            <p className="text-gray-300 text-lg font-light">Enter your username to join the conversation</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-200 mb-2 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username..."
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  maxLength={20}
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className={`w-5 h-5 ${username.trim() ? 'text-purple-400' : 'text-gray-500'} transition-colors duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400 text-right">{username.length}/20 characters</p>
            </div>

            <button
              type="submit"
              disabled={!username.trim() || isLoading}
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </>
                ) : (
                  <>
                    Join Chat
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Footer hint */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-gray-400 text-sm">
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Choose a unique username to get started
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinForm;
