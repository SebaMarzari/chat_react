import { useEffect, useState } from "react"
// Socket.io
import socket from "../../websocket"
// Ant Design
import { Badge, List } from "antd";

const listStyle = {
  height: '100%',
  overflow: 'auto',
};

const itemStyle = {
  cursor: 'pointer',
};

const titleStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
};

const Users = () => {
  const [data, setData] = useState([]);
  const currentUser = JSON.parse(sessionStorage.getItem('user'));
  const toUser = window.location.pathname.split('/')[2];

  useEffect(() => {
    socket.emit('users');
    socket.on('users', (newData) => {
      const users = newData.filter((u) => u.id !== currentUser.id);
      setData(users);
    });
  }, []);

  const handleSelect = (user) => {
    window.location.href = `/chat/${user.id}`;
    socket.emit('connectChat', user.id)
  };

  return (
    <>
      <List
        header="Usuarios"
        itemLayout="horizontal"
        dataSource={data}
        style={listStyle}
        renderItem={(user) => (
          <List.Item
            key={user.id}
            style={{
              ...itemStyle,
              backgroundColor: toUser === user.id ? '#e6f7ff' : '#fff',
            }}
            onClick={() => handleSelect(user)}
          >
            <List.Item.Meta
              title={
                user.userName && (
                  <div
                    style={titleStyle}
                  >
                    <span>{user.userName}</span>
                    <Badge
                      color={user.connected ? 'green' : 'red'}
                    />
                  </div>

                )
              }
            />
          </List.Item>
        )}
      />
    </>
  )
}

export default Users
