import React, { useState } from 'react';
// Socket.io
import socket from '../../websocket';
// Ant Design
import {
  Button,
  Form as AntForm,
  Input,
  Space
} from 'antd';

const loginStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid rgba(0, 0, 0, 0.2)',
  borderRadius: 4,
  padding: 20,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#cccccc10',
  flexDirection: 'column',
};

const Form = () => {
  const [typeForm, setTypeForm] = useState('login');
  const [title, setTitle] = useState('Iniciar sesión');

  const onFinish = (values) => {
    const { userName, password } = values;
    const user = {
      userName,
      password,
      connected: false,
    }
    socket.emit(typeForm, user);
    user.connected = true;
    socket.on(typeForm, (data) => {
      if (data?.error) {
        console.log(data.error);
        return;
      }
      const user = JSON.stringify(data.user);
      sessionStorage.setItem('user', user);
      window.location.reload();
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChangeForm = () => {
    if (typeForm === 'login') {
      setTypeForm('register');
      setTitle('Registrarse');
    } else {
      setTypeForm('login');
      setTitle('Iniciar sesión');
    }
  };

  return (
    <div
      className="space-align-container"
      style={{
        height: '100%',
      }}
    >
      <div
        className="space-align-block"
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Space align="center">

          <div
            style={loginStyle}
          >
            <AntForm
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <AntForm.Item
                label="Username"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: 'Porfavor ingrese un nombre de usuario!',
                  },
                ]}
              >
                <Input />
              </AntForm.Item>
              <AntForm.Item
                label="Contraseña"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Porfavor ingrese la contraseña!',
                  },
                ]}
              >
                <Input.Password />
              </AntForm.Item>

              <AntForm.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    marginRight: 10,
                  }}
                  id="login"
                >
                  {title}
                </Button>
              </AntForm.Item>
            </AntForm>
            <Button
              onClick={() => handleChangeForm()}
            >
              {typeForm === 'login' ? 'Registrarse' : 'Iniciar sesión'}
            </Button>
          </div>
        </Space>
      </div>
    </div>
  )
}

export default Form;