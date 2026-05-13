import { useState } from 'react';
import JoinForm from './components/JoinForm';
import ChatRoom from './components/ChatRoom';

function App() {
  const [username, setUsername] = useState(null);

  const handleJoin = (name) => {
    setUsername(name);
  };

  const handleLeave = () => {
    setUsername(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {!username ? (
        <JoinForm onJoin={handleJoin} />
      ) : (
        <ChatRoom username={username} onLeave={handleLeave} />
      )}
    </div>
  );
}

export default App;
