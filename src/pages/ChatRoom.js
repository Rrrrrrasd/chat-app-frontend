import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import api from '../api';

function ChatRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const roomName = location.state?.roomName || '채팅방';
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const clientRef = useRef(null);
  const scrollRef = useRef();

  // 메시지 이력 가져오기
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get(`/api/chat/rooms/${roomId}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error('메시지 이력 불러오기 실패', err);
      }
    }
    fetchHistory();
  }, [roomId]);

  // WebSocket 연결
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws-stomp');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ STOMP 연결됨');
        client.subscribe(`/topic/room.${roomId}`, (message) => {
          const msg = JSON.parse(message.body);
          setMessages(prev => [...prev, msg]);
        });
      },
      onDisconnect: () => {
        console.log('🛑 STOMP 연결 종료');
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  // 메시지 전송
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      chatRoomId: Number(roomId),
      message: newMessage,
    };

    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(msg),
    });

    setNewMessage('');
  };

  // 엔터로 전송
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  // 새 메시지 오면 스크롤 하단
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 채팅방 퇴장
  const handleLeaveRoom = async () => {
    if (!window.confirm('정말로 이 채팅방에서 퇴장하시겠습니까?')) return;

    try {
      await api.delete(`/api/chat/rooms/${roomId}/leave`);
      clientRef.current?.deactivate(); // ✅ WebSocket 연결 종료
      alert('채팅방에서 퇴장했습니다.');
      navigate('/');
    } catch (err) {
      console.error('퇴장 실패', err);
      alert('채팅방 퇴장에 실패했습니다.');
    }
  };

  return (
    <div>
      <h2>{roomName}</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
        <button onClick={handleLeaveRoom} style={{ backgroundColor: '#f44336', color: 'white' }}>
          퇴장
        </button>
      </div>

      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.nickname ?? msg.senderId}:</strong> {msg.message}
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요"
          style={{ width: '80%' }}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}

export default ChatRoom;
