import React, { useState, useEffect, useRef } from "react";
import { Avatar, Input, Button, Tooltip, Popover, message } from "antd";
import {
    SendOutlined, MoreOutlined, PhoneOutlined,
    VideoCameraOutlined, SmileOutlined, PaperClipOutlined, AudioOutlined,
    UserOutlined, PushpinOutlined, DeleteOutlined, PictureOutlined
} from "@ant-design/icons";
import styles from "./ChatBox.module.css"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import MessageContent from "../MessageContent/MessageContent";
import { deleteChatList, updateChatList } from "../../api/chatList";
import { ChatEventBus } from '../../eventBus/chatEventBus';
import { getMessageListBetweenUsers, updateMessage } from "../../api/message";
import WebSocketService from "../../utils/WebSocketService";
import { uploadFile } from "../../api/file";
import { compressImage } from "../../utils/compress";
import { getCurrentTime } from "../../utils/date";

const ChatBox = ({ user, friend, activeChat, onClose, onCloseUserInfo }) => {
    const [messages, setMessages] = useState([])
    useEffect(() => {
        // 修正：使用内部异步函数避免useEffect返回Promise
        const fetchMessages = async () => {
            if (user?.id && friend?.id) {
                await getMessages();
            }
        };
        fetchMessages();
    }, [user?.id, friend?.id]);

    const getMessages = async () => {
        try {
            const time = Date.now();
            const res = await getMessageListBetweenUsers(user.id, friend.id, time);
            if (res.code === 200) {
                setMessages(res.data);
                // 筛选未读消息 ID
                const unReadMessageIds = res.data
                    .filter(item => item.status === 0 && item.id)
                    .map(item => item.id);
                // 批量设置为已读
                markMessageAsRead(unReadMessageIds);
            } else {
                message.error(res.desc);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // 自动滚动到最新消息
    const messageEndRef = useRef(null)
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const [typeStatus, setTypeStatus] = useState(false)
    const handleTypingStatus = (isTyping) => {
        setTypeStatus(isTyping);
    };

    useEffect(() => {
        // 处理聊天对话框的消息
        const handleChatBoxMsg = (message) => {
            if (message.senderId !== friend.id) {
                return;
            }
            if (!['START_TYPING', 'END_TYPING'].includes(message.msgType)) {
                addMessage(
                    message.senderId,
                    message.content,
                    message.msgType,
                    getCurrentTime()
                );
                markMessageAsRead([message.id]);
                clearUnreadCount();
            } else {
                const isTyping = message.msgType === 'START_TYPING';
                handleTypingStatus(isTyping);
            }
        };
        ChatEventBus.on("updateChatBoxMessage", handleChatBoxMsg);
        return () => ChatEventBus.off("updateChatBoxMessage", handleChatBoxMsg);
    }, [friend?.id]);

    // 处理图片发送
    const fileInputRef = useRef(null);
    const handleSendImg = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const compressedFile = await compressImage(file);
        console.log('压缩后大小:', compressedFile.size / 1024 / 1024, 'MB');
        try {
            const result = await uploadFile(compressedFile, "/file/uploadFile", (progress) => {
                console.log(`上传进度: ${progress}%`);
            });
            if (result !== null && result.code === 200) {
                const msg = {
                    msgType: 'IMAGE',
                    senderId: user.id,
                    receiverId: friend.id,
                    content: result.data,
                };
                WebSocketService.send(msg);
                addMessage(user.id, result.data, msg.msgType, getCurrentTime());
            } else {
                console.error(result.desc)
                message.warning("发送图片失败:");
            }
        } catch (err) {
            console.error("请求出错:", err);
        } finally {
            event.target.value = "";
        }
    };

    // 处理消息发送
    const [inputValue, setInputValue] = useState("")
    const handleSend = () => {
        if (inputValue.trim()) {
            const msg = {
                msgType: 'TEXT',
                senderId: user.id,
                receiverId: friend.id,
                content: inputValue.trim(),
            };
            WebSocketService.send(msg);
            addMessage(user.id, inputValue, msg.msgType, getCurrentTime());
            setInputValue("");
            // 发送消息后立即结束输入状态
            endTyping();
        }
    };

    const addMessage = (id, content, msgType, createTime) => {
        setMessages(prevMessages => [
            ...prevMessages,
            { senderId: id, content: content.trim(), msgType: msgType, createTime: createTime }
        ]);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    // 输入表情
    const addEmoji = (data) => {
        let emoji = data.native;
        setInputValue(inputValue + emoji);
    };
    const emojiSelect = <Picker data={data} onEmojiSelect={addEmoji} />

    useEffect(() => {
        if (activeChat?.id) {
            clearUnreadCount();
        }
    }, [activeChat]);

    const clearUnreadCount = () => {
        updateChatList({
            id: activeChat.id,
            unreadCount: 0,
        })
            .then(res => {
                if (res.code !== 200) {
                    console.warn("清除未读数失败：", res.desc);
                }
            })
            .catch(err => {
                console.error("清除未读数出错", err);
            });
    };

    const markMessageAsRead = (messageIds) => {
        if (!Array.isArray(messageIds) || messageIds.length === 0) return;
        const messageList = messageIds.map(id => ({
            id,
            status: 1
        }));
        updateMessage(messageList)
            .then(res => {
                if (res.code !== 200) {
                    console.warn("设置消息已读失败：", res.desc);
                }
            })
            .catch(err => {
                console.error("已读更新失败", err);
            });
    };

    const moreContent = () => {
        return (
            <div className={styles.moreActions}>
                <div onClick={() => {
                    hide();
                    onCloseUserInfo();
                }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    用户信息
                </div>
                <div>
                    <PushpinOutlined style={{ marginRight: 8 }} />
                    置顶聊天
                </div>
                <span style={{ height: "1px", backgroundColor: '#f0f0f0', width: '90%', display: 'inline-block' }}></span>
                <div className={styles.deleteChat}>
                    <div onClick={handleDeleteChat}>
                        <DeleteOutlined style={{ marginRight: 8 }} />
                        删除聊天
                    </div>
                </div>
            </div>
        );
    };

    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = newOpen => {
        setOpen(newOpen);
    };

    const handleDeleteChat = () => {
        if (activeChat !== null) {
            deleteChatList(activeChat.id).then(res => {
                if (res.code === 200) {
                    ChatEventBus.emit('removeChat', { chatId: activeChat.id });
                    onClose()
                    hide();
                    onCloseUserInfo();
                } else {
                    message.error(res.desc)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }

    // 输入状态管理 - 优化部分
    const [isTyping, setIsTyping] = useState(false);
    const typingDebounceTimer = useRef(null);
    const DEBOUNCE_TIME = 2000; // 延迟2秒

    // 发送开始输入状态
    const startTyping = () => {
        if (!isTyping) {
            sendTypeStatusMessage('START_TYPING');
            setIsTyping(true);
        }
    };

    // 发送结束输入状态（带延迟）
    const endTyping = () => {
        if (isTyping) {
            // 清除之前的定时器
            if (typingDebounceTimer.current) {
                clearTimeout(typingDebounceTimer.current);
            }

            // 设置延迟定时器
            typingDebounceTimer.current = setTimeout(() => {
                sendTypeStatusMessage('END_TYPING');
                setIsTyping(false);
            }, DEBOUNCE_TIME);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // 清除之前的延迟定时器
        if (typingDebounceTimer.current) {
            clearTimeout(typingDebounceTimer.current);
        }

        // 输入框有内容时发送开始输入状态
        if (value.trim() !== "") {
            startTyping();
        } else {
            // 输入框为空时立即结束输入状态
            endTyping();
        }
    };

    const handleBlur = () => {
        // 输入框失去焦点时立即结束输入状态
        if (isTyping) {
            if (typingDebounceTimer.current) {
                clearTimeout(typingDebounceTimer.current);
            }
            sendTypeStatusMessage("END_TYPING");
            setIsTyping(false);
        }
    };

    const sendTypeStatusMessage = (typeStatus) => {
        try {
            const message = {
                msgType: typeStatus,
                senderId: user.id,
                receiverId: friend.id,
            };
            WebSocketService.send(message);
        } catch (error) {
            console.error('发送输入状态失败:', error);
        }
    };

    // 组件卸载时清理
    useEffect(() => {
        return () => {
            if (typingDebounceTimer.current) {
                clearTimeout(typingDebounceTimer.current);
            }
            if (isTyping) {
                sendTypeStatusMessage("END_TYPING");
                setIsTyping(false);
            }
        };
    }, [isTyping, user?.id, friend?.id]);

    return (
        <div className={styles.chatContainer}>
            {/*头部信息*/}
            <div className={styles.chatHeader}>
                <div className={styles.headerLeft}>
                    <Avatar src={friend?.avatar} size={40} style={{ marginRight: '16px' }} />
                    <div style={{ marginBottom: '-5px' }}>
                        <h2 className={styles.nickname}>{friend?.nickname}</h2>
                        <small className={styles.status}>
                            {typeStatus ? '正在输入中....' : ''}
                        </small>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <Tooltip title={"语音通话"} className={`${styles.headerAction} ${styles.chatBtn}`}>
                        <PhoneOutlined className={styles.iconBtn} />
                    </Tooltip>
                    <Tooltip title={"视频通话"} className={`${styles.headerAction} ${styles.videoBtn}`}>
                        <VideoCameraOutlined className={styles.iconBtn} />
                    </Tooltip>
                    <Popover placement="bottomRight" content={moreContent}
                             className={styles.headerAction} trigger="click" open={open}
                             onOpenChange={handleOpenChange}>
                        <MoreOutlined className={styles.iconBtn} />
                    </Popover>
                </div>
            </div>
            {/*中间聊天区*/}
            <div className={styles.chatContent}>
                <div className={styles.messageList}>
                    {messages?.map((msg, index) => (
                        <div key={index} className={`${styles.messageItem} ${msg.senderId === user?.id ? styles.right : styles.left}`}>
                            {msg.senderId !== user?.id ? (
                                <>
                                    <Avatar src={friend?.avatar} size={50} className={styles.msgAvatarLeft} />
                                    <MessageContent message={msg} user={user} friend={friend} />
                                </>
                            ) : (
                                <>
                                    <MessageContent message={msg} user={user} friend={friend} />
                                    <Avatar src={user?.avatar} size={50} className={styles.msgAvatarRight} />
                                </>
                            )}
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>
            </div>
            {/*底部输入框*/}
            <div className={styles.chatFooter}>
                <div className={styles.sendMsgContainer}>
                    <div className={styles.emojiAction}>
                        <Popover placement="topLeft" title={'表情选择'} content={emojiSelect}>
                            <Button icon={<SmileOutlined />} className={styles.emojiBtn} />
                        </Popover>
                    </div>
                    <Input
                        className={styles.inputBox}
                        placeholder="输入消息..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                    />
                    <div className={styles.sendBtns}>
                        <Button icon={<PictureOutlined />} className={styles.sendBtn} onClick={handleSendImg} />
                        <Button icon={<PaperClipOutlined />} className={styles.sendBtn} />
                        <Button icon={<AudioOutlined />} className={styles.sendBtn} />
                        <Button type={"primary"} icon={<SendOutlined />} className={styles.sendBtn} onClick={handleSend} />
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}

export default ChatBox
