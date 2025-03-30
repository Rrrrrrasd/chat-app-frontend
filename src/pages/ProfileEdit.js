import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function ProfileEdit() {
  const [profile, setProfile] = useState({ statusMessage: '', profileImage: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        // 현재 사용자 정보 가져오기 (토큰 기반으로 인증된 사용자 정보)
        const userResponse = await api.get('/api/auth/me');
        const user = userResponse.data;
        // 해당 사용자의 프로필 정보 가져오기
        const profileResponse = await api.get(`/api/user-profiles/${user.id}`, profile);
        console.log("받은 프로필:", profileResponse.data); // 👈 확인용 로그
        setProfile(profileResponse.data);
      } catch (err) {
        setError('프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/user-profiles/${profile.id}`, profile);
      alert('프로필이 업데이트되었습니다.');
      navigate('/');
    } catch (err) {
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  return (
    <div>
      <h2>프로필 수정</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>상태 메시지: </label>
            <input 
              type="text" 
              name="statusMessage" 
              value={profile.statusMessage} 
              onChange={handleChange} />
          </div>
          <div>
            <label>프로필 이미지 URL: </label>
            <input 
              type="text" 
              name="profileImage" 
              value={profile.profileImage} 
              onChange={handleChange} />
          </div>
          <button type="submit">저장</button>
          <button type="button" onClick={() => navigate('/')}>취소</button>
        </form>
      )}
    </div>
  );
}

export default ProfileEdit;
