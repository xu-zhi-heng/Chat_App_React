import React, { useState } from 'react';
import { Form, Input, Button, Upload, Card, message, Modal, Typography } from 'antd';
import { PlusOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { register } from '../../api/auth';
import registerPng from "../../assets/image/chat_register.png"
import {uploadFile} from "../../api/file";
import WebSocketService from "../../utils/WebSocketService";
import {getCurrentTime} from "../../utils/date";

const { Title, Text, Link } = Typography;

const Register = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registerSuccessMessage, setRegisterSuccessMessage] = useState('');
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const navigate = useNavigate();

    const showModal = () => setIsModalOpen(true);
    const handleOk = () => {
        setIsModalOpen(false);
        setTimeout(() => navigate('/login'), 500);
    };
    const handleCancel = () => setIsModalOpen(false);

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
            message.error('只能上传图片文件！');
            return false;
        }
        if (!isLt2M) {
            message.error('图片大小不能超过 2MB！');
            return false;
        }
        setFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        return false;
    };

    const handleRemove = () => {
        setFile(null);
        setPreviewUrl('');
    };

    const onFinish = async (values) => {
        if (values.password !== values.confirmPassword) {
            return message.error('两次输入的密码不一致！');
        }

        let avatarPath = '';
        try {
            if (file) {
                const result = await uploadFile(file, "/file/uploadFile", (progress) => {
                    console.log(`上传进度: ${progress}%`);
                });
                if (result !== null && result.code === 200) {
                    avatarPath= result.data
                } else {
                    console.error(result.desc)
                    message.warning("上传头像失败:");
                }

                // 这是之前node上传文件的
                // const fileForm = new FormData();
                // fileForm.append('avatar', file);
                // const uploadRes = await axios.post('http://localhost:9090/api/auth/uploadFile', fileForm, {
                //     headers: { 'Content-Type': 'multipart/form-data' },
                // });
                // if (uploadRes.status === 200 && uploadRes.data.path) {
                //     avatarPath = uploadRes.data.path;
                // } else {
                //     message.error(uploadRes.data.message);
                // }
            }

            const registerData = {
                nickname: values.nickname,
                password: values.password,
                email: values.email,
                phone: values.phone,
                avatar: avatarPath,
            };

            const res = await register(registerData);
            if (res.code === 200) {
                showModal();
                setRegisterSuccessMessage(`注册成功，请登录，您的账号为：${res.data}`);
            } else {
                message.error(res.data.desc);
            }
        } catch (err) {
            console.error(err);
            message.error('注册失败，请稍后再试');
        } finally {
            form.resetFields();
            setFile(null);
        }
    };

    return (
        <div className={styles.registerWrapper}>
            <Modal
                title="消息提示"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="立即登录"
                cancelText="取消"
            >
                {registerSuccessMessage}
            </Modal>

            <div className={styles.leftPanel}>
                <Title level={2}>Welcome to SweetFunChat</Title>
                <Text>Connect with your friends and colleagues seamlessly.</Text>
                <img
                    src={registerPng}
                    alt="注册插图"
                    className={styles.leftImage}
                />
            </div>

            <div className={styles.rightPanel}>
                <Card className={styles.registerCard} variant="borderless">
                    <div className={styles.avatarWrapper}>
                        <Upload
                            beforeUpload={beforeUpload}
                            onRemove={handleRemove}
                            fileList={file ? [file] : []}
                            maxCount={1}
                            accept="image/*"
                            showUploadList={false}
                        >
                            <div className={styles.avatarUploadBox}>
                                {previewUrl ? (
                                    <img src={previewUrl} alt="头像预览" className={styles.avatarPreview} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        <PlusOutlined style={{ fontSize: 24, color: '#999' }} />
                                    </div>
                                )}
                            </div>
                        </Upload>
                    </div>

                    <Form form={form} layout="vertical" onFinish={onFinish} className={styles.form}>
                        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
                            <Input prefix={<UserOutlined />} placeholder="请输入昵称" />
                        </Form.Item>

                        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
                        </Form.Item>

                        <Form.Item name="confirmPassword" label="确认密码" rules={[{ required: true, message: '请确认密码' }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" />
                        </Form.Item>

                        <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}>
                            <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                        </Form.Item>

                        <Form.Item name="phone" label="手机号" rules={[{ pattern: /^\d{11}$/, message: '请输入11位手机号' }]}>
                            <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            注册
                        </Button>

                        <Form.Item className={styles.loginRegisterLink}>
                            <Text>Already have an account? </Text>
                            <Link href="/login">Sign in </Link>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
