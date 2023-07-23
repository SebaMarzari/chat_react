import React from 'react';
// Antd
import { Button } from 'antd';
// Socket.io
import socket from '../../websocket';

const container = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  padding: '0 1rem',
};

const Navbar = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const handleLogout = () => {
    socket.emit('logout', user);
    user.connected = false;
    sessionStorage.setItem('user', JSON.stringify(user));
    window.location.href = '/';
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
      }}
    >
      {user.userName}
      <div
        style={container}
      >
        {
          user && (
            <Button
              onClick={handleLogout}
              type="primary"
            >
              Salir
            </Button>
          )
        }
      </div>
    </div>
  );
}

export default Navbar;