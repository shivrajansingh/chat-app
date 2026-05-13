function UserList({ users, currentUser }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 h-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="text-lg font-semibold text-white">Online Users</h3>
        <span className="ml-auto text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
          {users.length}
        </span>
      </div>

      <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {users.map((user, index) => (
          <li
            key={index}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
              user === currentUser
                ? 'bg-purple-600/30 border border-purple-500/30'
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            {/* Avatar with gradient */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
              {user.charAt(0).toUpperCase()}
            </div>
            
            {/* Username */}
            <span className={`text-sm font-medium ${user === currentUser ? 'text-white' : 'text-gray-300'}`}>
              {user}
              {user === currentUser && (
                <span className="ml-2 text-xs text-purple-300">(You)</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No users online</p>
        </div>
      )}
    </div>
  );
}

export default UserList;
