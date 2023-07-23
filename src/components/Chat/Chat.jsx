import React, { useEffect, useState } from 'react';
import socket from '../../websocket';
import { Input, Button } from 'antd';
import { ChatComponent } from './components';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const toUser = window.location.pathname.split('/')[2];
  const fromUser = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    socket.emit('messages');
    socket.on('messages', (data) => {
      setMessages(data);
    });
  }, []);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', { isTyping: false, to: toUser });
    }, 5000);

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [inputValue]);

  const handleSendMessage = () => {
    if (inputValue) {
      const id = Math.floor(Math.random() * 1000000);
      const newMessage = {
        id,
        from: fromUser.id,
        to: toUser,
        text: inputValue,
        createdBy: fromUser.id,
      };

      socket.emit('newMessage', newMessage);
      setMessages([...messages, newMessage]);
      setIsTyping(false);
      socket.emit('typing', { isTyping: false, to: toUser });
      setInputValue('');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsTyping(true);
    socket.emit('typing', { isTyping: true, to: toUser });
  };

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      {
        toUser ? (
          <div>

            <div
              style={{
                height: 'calc(100vh - 192px)',
                displayflex: 'flex',
              }}
            >
              <ChatComponent messages={messages} isTyping={isTyping} />
            </div>

            <div
              style={{
                height: '64px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                gap: 5,
              }}
            >
              <Input
                placeholder="Escribe un mensaje..."
                value={inputValue}
                onChange={handleInputChange}
              />
              <Button type="primary" onClick={handleSendMessage}>
                Enviar
              </Button>
            </div>
          </div>
        ) : (
          (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <p
                style={{
                  textAlign: 'center',
                  color: '#000',
                }}
              >
                Selecciona un usuario para comenzar a chatear
              </p>
            </div>
          )
        )
      }
    </div>
  );
};

export default Chat;
