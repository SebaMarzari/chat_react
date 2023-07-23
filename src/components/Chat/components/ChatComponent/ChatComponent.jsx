import React, { useState, useEffect, useRef } from 'react';
// Socket.io
import socket from '../../../../websocket';

const ChatComponent = ({ messages }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [filterMessages, setFilterMessages] = useState([])
  const currentUser = JSON.parse(sessionStorage.getItem('user'));
  const chatContainer = useRef(null);
  const getUserTo = window.location.pathname.split('/')[2];
  socket.on(`typing${currentUser.id}`, (isTyping) => {
    setIsTyping(isTyping);
  });

  useEffect(() => {
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    const filter = messages.filter((message) => (message.from === currentUser.id && message.to === getUserTo) || (message.from === getUserTo && message.to === currentUser.id))
    setFilterMessages(filter)
  }, [messages]);

  return (
    <div
      ref={chatContainer}
      style={styles.chatContainer}
    >
      {getUserTo && filterMessages && filterMessages.length && filterMessages.map((message, index) => (
        <div
          key={index}
          style={
            message.from === currentUser.id
              ? { ...styles.message, ...styles.sentMessage }
              : { ...styles.message, ...styles.receivedMessage }
          }
        >
          <p style={styles.text}>{message.text}</p>
        </div>
      ))}
      {getUserTo && isTyping && (
        <div
          style={styles.typingContainer}
        >
          <p style={styles.typing}>Typing...</p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;

const styles = {
  chatContainer: {
    padding: '10px',
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  message: {
    maxWidth: '80%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
    width: 'max-content',
    padding: '1rem',
  },
  sentMessage: {
    alignSelf: 'end',
    backgroundColor: '#dcf8c6',
    color: '#000',
    borderRadius: '10px 10px 0 10px',
  },
  receivedMessage: {
    alignSelf: 'start',
    backgroundColor: '#dcf8c6',
    color: '#000',
    borderRadius: '10px 10px 10px 0',
  },
  text: {
    margin: '0',
    height: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  typingContainer: {
    alignSelf: 'start',
    backgroundColor: '#dcf8c6',
    color: '#000',
    borderRadius: '10px 10px 10px 0',
    padding: '1rem',
    height: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  typing: {
    margin: 0,
    height: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
};
