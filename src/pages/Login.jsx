import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { login } from '../api/auth';
import '../assets/css/Login.css';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    // 登录方法
    const onLogin = async (values) => {
        setLoading(true);
        try {
            const res = await login(values);
            if (res.code === 200) {
                message.success('登录成功');
                localStorage.setItem('sweet_fun_token', res.data);
                navigate('/home');
            } else {
                message.error(res.msg || '登录失败');
            }
        } catch (error) {
            message.error('请求出错，请稍后再试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Form name="login" onFinish={onLogin} className="login-form">
                <h2>用户登录</h2>
                {/* 用户名输入框 */}
                <Form.Item name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
                    <Input placeholder="用户名" />
                </Form.Item>
                {/* 密码输入框 */}
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
                    <Input.Password placeholder="密码" />
                </Form.Item>
                {/* 登录按钮 */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
