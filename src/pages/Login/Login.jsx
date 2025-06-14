import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Layout, message } from 'antd';
import { login } from '../../api/auth';
import styles from './Login.module.css';
import loginPng from "../../assets/image/chat_login.png";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

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
                sessionStorage.setItem('sweet_fun_token', res.data);
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

    const onFinishFailed = (errorInfo) => {
        console.log('Login failed:', errorInfo);
    };

    return (
        <Layout className={styles.loginLayout}>
            <Content className={styles.loginContent}>
                <div className={styles.loginLeft}>
                    <div className={styles.loginLeftContent}>
                        <Title level={2}>Welcome to SweetFunChat</Title>
                        <Text>Connect with your friends and colleagues seamlessly.</Text>
                        <img
                            src={loginPng}
                            alt="登录插图"
                            className={styles.leftImage}
                        />
                    </div>
                </div>

                <div className={styles.loginRight}>
                    <div className={styles.loginFormContainer}>
                        <Title level={3}>登 录</Title>
                        <Form
                            layout="vertical"
                            name="login"
                            onFinish={onLogin}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="账号"
                                name="username"
                                rules={[{ required: true, message: '请输入系统账号' }]}
                            >
                                <Input type="text" placeholder="输入系统账号" />
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="password"
                                rules={[{ required: true, message: '请输入登录密码' }]}
                            >
                                <Input.Password placeholder="输入登录密码" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                >
                                    登 录
                                </Button>
                            </Form.Item>

                            <Form.Item className={styles.loginRegisterLink}>
                                <Text>Don't have an account? </Text>
                                <Link href="/register">Register</Link>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default Login;
