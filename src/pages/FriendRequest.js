import React, { useEffect, useState } from 'react';
import api from '../api';

function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
    const res = await api.get('/api/friendships/requests');
    setRequests(res.data);
    } catch (e) {
      console.error('친구 요청 목록 불러오기 실패', e);
    }
  };

  const handleRespond = async (friendshipId, requesterId, action) => {
    try {
      await api.put('/api/friendships/', {
        id: friendshipId,
        userId: requesterId,       // 요청 보낸 사람
        friendId: Number(userId),  // 나 (요청 받은 사람)
        status: action             // 'ACCEPTED' or 'REJECTED'
      });
      alert(`요청을 ${action === 'ACCEPTED' ? '수락' : '거절'}했습니다.`);
      fetchRequests(); // 목록 갱신
    } catch (e) {
      console.error('응답 실패', e);
    }
  };

  return (
    <div>
      <h2>받은 친구 요청</h2>
      {requests.length === 0 ? (
        <p>받은 요청이 없습니다.</p>
      ) : (
        <ul>
          {requests.map(req => (
            <li key={req.id} style={{ marginBottom: '10px' }}>
                요청 보낸 사용자: {req.nickname} {/* 👈 닉네임 표시 */}
                <button onClick={() => handleRespond(req.id, req.requesterId, 'ACCEPTED')} style={{ marginLeft: '10px' }}>
                수락
                </button>
                <button onClick={() => handleRespond(req.id, req.requesterId, 'REJECTED')} style={{ marginLeft: '5px' }}>
                거절
                </button>
            </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default FriendRequests;
