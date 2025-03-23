// src/components/ChatTest.js
import React, { useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatTest = () => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  // 입력값 상태
  const [chatRoomId, setChatRoomId] = useState(1);
  const [senderId, setSenderId] = useState(1);
  const [message, setMessage] = useState('');

  // Connect 버튼 클릭
  const connect = () => {
    // 1) SockJS로 서버(WebSocketConfig)에서 등록한 endpoint (/ws-stomp) 연결
    const socket = new SockJS('http://localhost:8080/ws-stomp');
    // 2) STOMP 클라이언트 생성
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log('Connected: ', frame);
        setConnected(true);

        // /topic/public 구독
        client.subscribe('/topic/public', (msg) => {
          const received = JSON.parse(msg.body);
          console.log('수신 메시지:', received);
          alert('수신 메시지: ' + JSON.stringify(received));
        });
      },
      onDisconnect: () => {
        console.log('Disconnected');
        setConnected(false);
      },
      // 에러 핸들러 등 필요 시 추가
    });

    // 3) 실제 연결 시도
    client.activate();
    setStompClient(client);
  };

  // Disconnect 버튼 클릭
  const disconnect = () => {
    if (stompClient) {
      stompClient.deactivate(); // 연결 종료
    }
    setConnected(false);
    console.log('Disconnected');
  };

  // 메시지 전송
  const sendMessage = () => {
    if (!stompClient || !connected) {
      alert('먼저 Connect를 해주세요!');
      return;
    }
    const msgObj = {
      chatRoomId: chatRoomId,
      senderId: senderId,
      message: message
    };
    // @MessageMapping("/chat.sendMessage")로 전송
    stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(msgObj),
    });
    setMessage('');
  };

  return (
    <div>
      <h1>React WebSocket STOMP Test</h1>
      <div>
        <button onClick={connect} disabled={connected}>Connect</button>
        <button onClick={disconnect} disabled={!connected}>Disconnect</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label>chatRoomId: </label>
        <input
          type="number"
          value={chatRoomId}
          onChange={(e) => setChatRoomId(e.target.value)}
        />
      </div>
      <div>
        <label>senderId: </label>
        <input
          type="number"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
        />
      </div>
      <div>
        <label>message: </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatTest;
