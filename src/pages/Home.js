import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { initAuth } from '../api';

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // 🔧 사용자 정보 상태
  const navigate = useNavigate();

  // 로그인 상태 확인 및 사용자 정보 + 방 목록 불러오기
  useEffect(() => {
    async function checkAuth() {
      try {
        const result = await initAuth();
        setIsAuthenticated(result);
        if (result) {
          const userRes = await api.get('/api/auth/me'); // 🔧 현재 사용자 정보 가져오기
          setCurrentUser(userRes.data);
          await fetchRooms();
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const fetchRooms = async () => {
    try {
      const myRoomsResponse = await api.get('/api/chat/myrooms');
      const allRoomsResponse = await api.get('/api/chat/rooms');

      const myRooms = (myRoomsResponse.data || []).map(room => ({ ...room, joined: true }));
      const myRoomIds = myRooms.map(room => room.id);
      const notJoinedRooms = (allRoomsResponse.data || [])
        .filter(room => !myRoomIds.includes(room.id))
        .map(room => ({ ...room, joined: false }));

      setRooms([...myRooms, ...notJoinedRooms]);
    } catch (err) {
      console.error(err);
      setError('채팅방 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      console.error('로그아웃 실패', err);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await api.post(`/api/chat/rooms/${roomId}/join`);
      await fetchRooms();
    } catch (err) {
      console.error('채팅방 참여 실패', err);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }

    if (!currentUser?.id) {
      alert("사용자 인증 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    try {
      const res = await api.post(`/api/chat/rooms?name=${encodeURIComponent(newRoomName)}&createdBy=${currentUser.id}`);
      alert(`채팅방 "${res.data.name}" 생성 완료`);
      setNewRoomName('');
      await fetchRooms();
    } catch (err) {
      console.error('채팅방 생성 실패', err);
      alert('채팅방 생성에 실패했습니다.');
    }
  };

  if (!authChecked) return <p>확인 중...</p>;

  return (
    <div>
      {/* 상단 헤더 */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>홈</h2>
        <div>
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/friends')} style={{ marginLeft: '10px' }}>친구 목록</button>
              <button onClick={() => navigate('/add-friend')} style={{ marginLeft: '10px' }}>친구 요청 보내기</button>
              <button onClick={() => navigate('/friend-requests')} style={{ marginLeft: '10px' }}>받은 친구 요청</button>
              <button onClick={() => navigate('/profile')} style={{ marginRight: '10px' }}>프로필 수정</button>
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>로그인</button>
              <button onClick={() => navigate('/signup')}>회원가입</button>
            </>
          )}
        </div>
      </header>

      <hr />

      {isAuthenticated && (
        <div style={{ marginBottom: '20px' }}>
          <h3>채팅방 만들기</h3>
          <input
            type="text"
            placeholder="채팅방 이름"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleCreateRoom}>채팅방 생성</button>
        </div>
      )}

      <h3>채팅방 목록</h3>
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {rooms.map(room => (
            <li key={room.id} style={{ marginBottom: '10px' }}>
              <strong>{room.name}</strong>
              {room.joined ? (
                <>
                  <span style={{ marginLeft: '10px', color: 'green' }}>참여중</span>
                  <button
                    onClick={() => navigate(`/chat/${room.id}`, { state: { roomName: room.name } })}
                    style={{ marginLeft: '10px' }}
                  >
                    입장
                  </button>
                </>
              ) : (
                <button onClick={() => handleJoinRoom(room.id)} style={{ marginLeft: '10px' }}>
                  참여하기
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
