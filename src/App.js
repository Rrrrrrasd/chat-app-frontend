import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ProfileEdit from './pages/ProfileEdit';
import ChatRoom from './pages/ChatRoom';
import Friends from './pages/Friends';
import FriendRequests from './pages/FriendRequest';
import AddFriend from './pages/AddFriend';

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/signup">Signup</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfileEdit />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friend-requests" element={<FriendRequests />} />
        <Route path="/add-friend" element={<AddFriend />} />
      </Routes>
    </Router>
  );
}

export default App;
