import { useEffect, useState } from "react";
// Socket.io
import socket from "./websocket";
// Ant Design
import { Layout, notification, Button } from 'antd';
// Components
import { Chat, Navbar, Form, Users } from "./components";

const { Header, Footer, Sider, Content } = Layout;

const layoutStyle = {
  minHeight: '100vh',
};

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};

const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#fff',
  height: 'calc(100vh - 128px)',
};

const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#fff',
  borderRight: '1px solid rgba(0, 0, 0, 0.1)',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
  maxHeight: 'calc(100vh - 128px)',
};

const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};

const App = () => {
  const [api, contextHolder] = notification.useNotification();
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor');
    });
    socket.on('notification', (data) => {
      openNotification(data.message, data.status);
    });
  }, []);

  const openNotification = (message, status) => {
    if (status === 'connect'){
      api.success({
        message: message,
        placement: "topRight",
      });
      return;
    }
    if (status === 'disconnect' || status === 'error'){
      api.error({
        message: message,
        placement: "topRight",
      });
      return;
    }
    if (status === 'login') {
      api.info({
        message: message,
        placement: "topRight",
      });
    }
  };

  return (
    <Layout
      style={layoutStyle}
    >
      {contextHolder}
      <Header style={headerStyle}>
        <Navbar />
      </Header>
      <Layout>
        {
          user && user.connected && (
            <Sider style={siderStyle}>
              <Users />
            </Sider>
          )
        }
        <Content style={contentStyle}>
          {
            user && user.connected ? (
              <Chat />
            ) : (
              <div
                style={{
                  height: '100%',
                }}
              >
                <Form />
              </div>
            )
          }
        </Content>
      </Layout>
      <Footer style={footerStyle}>Proyecto Chat con React</Footer>
    </Layout>
  );
}

export default App;
