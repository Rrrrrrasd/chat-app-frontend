import React, { useState } from 'react';
import api from '../api';

function AddFriend() {
  const [nickname, setNickname] = useState('');
  const userId = localStorage.getItem('userId');

  const handleSendRequest = async () => {
    try {
      await api.post('/api/friendships/by-nickname', null, {
        params: {
            nickname: nickname
        }
      });
      alert('친구 요청을 보냈습니다!');
      setNickname('');
    } catch (e) {
      console.error('친구 요청 실패', e);
      alert('친구 요청에 실패했습니다: ' + (e.response?.data || '오류'));
    }
  };

  return (
    <div>
      <h2>친구 요청 보내기</h2>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임 입력"
      />
      <button onClick={handleSendRequest} style={{ marginLeft: '10px' }}>
        요청 보내기
      </button>
    </div>
  );
}

export default AddFriend;
