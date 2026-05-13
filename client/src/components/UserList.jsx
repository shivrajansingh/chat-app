function UserList({ users, currentUser, onClose }) {
  return (
    <div className="backdrop-blur-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-2xl p-5 h-full flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
        <div className="relative">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">Online Users</h3>
        <span className="ml-auto text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 rounded-full shadow-lg">
          {users.length}
        </span>
        <button
          onClick={onClose}
          className="lg:hidden ml-2 p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* User list */}
      <ul className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {users.map((user, index) => (
          <li
            key={index}
            className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
              user === currentUser
                ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                : 'hover:bg-white/10 border border-transparent hover:border-white/10 hover:shadow-lg'
            }`}
          >
            {/* Avatar with gradient and status indicator */}
            <div className="relative">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                user === currentUser 
                  ? 'from-purple-500 via-pink-500 to-indigo-600' 
                  : 'from-cyan-500 to-blue-600'
              } flex items-center justify-center text-white text-base font-bold shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 group-hover:scale-110`}>
                {user.charAt(0).toUpperCase()}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg"></div>
            </div>
            
            {/* Username */}
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-semibold truncate block ${
                user === currentUser ? 'text-white' : 'text-gray-200 group-hover:text-white'
              }`}>
                {user}
              </span>
              {user === currentUser && (
                <span className="text-xs text-purple-300 font-medium">You</span>
              )}
            </div>

            {/* Status icon for current user */}
            {user === currentUser && (
              <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </li>
        ))}
      </ul>

      {/* Empty state */}
      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">No users online</p>
          <p className="text-gray-500 text-xs mt-1">Be the first to join!</p>
        </div>
      )}
    </div>
  );
}

export default UserList;
