import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [showBlocked, setShowBlocked] = useState(false);
  const navigate = useNavigate();

  // 현재 사용자 ID (예시로 localStorage에서 가져옴; 실제 구현에서는 인증 컨텍스트 등을 사용할 수 있음)
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchFriends() {
      try {
        const res = await api.get('/api/friendships/my');
        setFriends(res.data);
      } catch (e) {
        console.error('친구 목록 불러오기 실패', e);
      }
    }
    fetchFriends();
  }, []);

  const startChat = async (friendId, nickname) => {
    try {
      const res = await api.post('/api/chat/private/start', { friendId });
      const roomId = res.data;
      navigate(`/chat/${roomId}`, { state: { roomName: `${nickname}님과의 채팅` } });
    } catch (e) {
      console.error('1:1 채팅 시작 실패', e);
      alert('채팅방 생성에 실패했습니다.');
    }
  };

  // 친구 차단 기능
  const handleBlock = async (targetId) => {
    try {
      await api.put('/api/friendships/block', {}, { params: { targetId } });
      alert('차단 완료');
      setFriends(friends.filter(friend => friend.friendId !== targetId));
    } catch (e) {
      console.error('차단 실패', e);
      alert('차단에 실패했습니다.');
    }
  };

  // 차단 목록을 불러오는 함수
  const fetchBlockedUsers = async () => {
    try {
      const res = await api.get('/api/friendships/blocked', { params: { userId: currentUserId } });
      setBlockedUsers(res.data);
    } catch (e) {
      console.error('차단 목록 불러오기 실패', e);
      alert('차단 목록 불러오기에 실패했습니다.');
    }
  };

  // 차단 해제 기능
  const handleUnblock = async (targetId) => {
    try {
      await api.put('/api/friendships/unblock', {}, { params: { targetId } });
      alert('차단 해제 완료');
      // 차단 해제된 항목은 차단 목록에서 제거
      setBlockedUsers(blockedUsers.filter(user => user.friendId !== targetId));
    } catch (e) {
      console.error('차단 해제 실패', e);
      alert('차단 해제에 실패했습니다.');
    }
  };

  // 차단 목록 토글 버튼
  const toggleBlockedList = async () => {
    if (!showBlocked) {
      await fetchBlockedUsers();
    }
    setShowBlocked(!showBlocked);
  };

  return (
    <div>
      <h2>내 친구 목록</h2>
      <ul>
        {friends.map(friend => (
          <li key={friend.id} style={{ marginBottom: '10px' }}>
            친구 닉네임: {friend.nickname}
            <button
              onClick={() => startChat(friend.friendId, friend.nickname)}
              style={{ marginLeft: '10px' }}
            >
              1:1 채팅
            </button>
            <button
              onClick={() => handleBlock(friend.friendId)}
              style={{ marginLeft: '10px' }}
            >
              차단
            </button>
          </li>
        ))}
      </ul>
      <button onClick={toggleBlockedList}>
        {showBlocked ? '차단 목록 숨기기' : '차단 목록 보기'}
      </button>
      {showBlocked && (
        <div>
          <h3>차단된 사용자 목록</h3>
          <ul>
            {blockedUsers.map(blocked => (
                <li key={blocked.id} style={{ marginBottom: '10px' }}>
                차단된 사용자: {blocked.nickname}
                <button
                    onClick={() => handleUnblock(blocked.friendId)}
                    style={{ marginLeft: '10px' }}
                >
                    차단 해제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Friends;
