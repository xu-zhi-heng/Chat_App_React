import React, { useState } from 'react';
import { Form, Input, Button, Upload, Card, message, Modal, Space } from 'antd';
import { UploadOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import '../assets/css/Register.css';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import {register} from "../api/auth";

const Register = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            navigate("/login")
        }, 500)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [registerSuccessMessage, setRegisterSuccessMessage] = useState("")

    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const [previewUrl, setPreviewUrl] = useState("")
    // 上传前检查
    const beforeUpload = (file) => {
        // 检查文件类型和大小
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImage) {
            message.error('只能上传图片文件！');
            return false;
        }
        if (!isLt2M) {
            message.error('图片大小不能超过 2MB！');
            setPreviewUrl(URL.createObjectURL(file)); // 设置预览 URL
            return false;
        }

        // 设置文件
        setFile(file);
        message.success(`${file.name} 选择成功`);
        return false; // 阻止默认上传行为
    }

    const handleRemove = () => {
        setFile(null);
        setPreviewUrl("");
    };

    // 提交注册
    const onFinish = async (values) => {
        if (values.password !== values.confirmPassword) {
            return message.error('两次输入的密码不一致！');
        }
        let avatarPath = ""
        try {
            if (file) {
                const fileFrom = new FormData();
                fileFrom.append('avatar', file);
                const uploadRes = await axios.post("http://localhost:9090/api/auth/uploadFile", fileFrom, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                if (uploadRes.status === 200 && uploadRes.data.path) {
                    avatarPath = uploadRes.data.path
                } else {
                    message.error(uploadRes.data.message)
                }
            }
            const registerData = {
                nickname: values.nickname,
                password: values.password,
                email: values.email,
                phone: values.phone,
                avatar: avatarPath,
            }
            const res = await register(registerData)
            if (res.code === 200) {
                showModal()
                setRegisterSuccessMessage("注册成功，请登录, 您的账号为:" + res.data)
            } else {
                message.error(res.data.desc)
            }
        } catch (err) {
            console.error(err);
            message.error('注册失败，请稍后再试')
        } finally {
            form.resetFields()
            setFile(null)
        }
    };

    return (
        <div style={{margin: '0 auto', width: "100vw"}}>
            <Modal
                title="消息提示"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="立即登录"
                cancelText="取消"
            >
                { registerSuccessMessage }
            </Modal>

            <div className="register-container">
                <Card className="register-card" variant={false}>
                    <h2 className="register-title">用户注册</h2>
                    <div className="register-content">
                        <div className="form-left">
                            <Form form={form} onFinish={onFinish} layout="vertical">
                                <Form.Item
                                    name="nickname"
                                    label="昵称"
                                    rules={[{ required: true, message: '请输入昵称' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="请输入昵称" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="密码"
                                    rules={[{ required: true, message: '请输入密码' }]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    label="确认密码"
                                    rules={[{ required: true, message: '请确认密码' }]}
                                >
                                    <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="邮箱"
                                    rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="手机号"
                                    rules={[
                                        { pattern: /^\d{11}$/, message: '请输入11位手机号' },
                                    ]}
                                >
                                    <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="form-right">
                            {previewUrl && (
                                <img src={previewUrl} alt="头像预览" className="avatar-preview" />
                            )}
                            <Upload
                                beforeUpload={beforeUpload}
                                onRemove={handleRemove}
                                fileList={file ? [file] : []}
                                maxCount={1}
                                accept="image/*"
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>选择头像</Button>
                            </Upload>
                            <Button type="primary" htmlType="submit" className="register-btn" onClick={() => form.submit()}>
                                注册
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;
