import React, { useState, useEffect, useRef } from "react";
import { Avatar, Input, Button, Tooltip, Popover, message } from "antd";
import {
    SendOutlined, MoreOutlined, PhoneOutlined,
    VideoCameraOutlined,SmileOutlined, PaperClipOutlined,AudioOutlined,
    UserOutlined, PushpinOutlined, DeleteOutlined,
} from "@ant-design/icons";
import styles from "./ChatBox.module.css"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import MessageContent from "../MessageContent/MessageContent";
import {deleteChatList, updateChatList} from "../../api/chatList";
import { ChatEventBus } from '../../eventBus/chatEventBus';
import {getMessageListBetweenUsers, updateMessage} from "../../api/message";
import WebSocketService from "../../utils/WebSocketService";

const ChatBox = ({user, friend, activeChat, onClose, onCloseUserInfo}) => {
    const [messages, setMessages] = useState([])
    useEffect(() => {
        if (user?.id && friend?.id) {
            getMessages();
        }
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
        } catch (err) {w
            console.error(err);
        }
    };

    // 自动滚动到最新消息
    const messageEndRef = useRef(null)
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])

    useEffect(() => {
        // 处理聊天对话框的消息
        const handleChatBoxMsg = (message) => {
            if (message.senderId === friend.id) {
                addMessage(message.senderId, message.content, message.msgType);
                markMessageAsRead([message.id]);
                clearUnreadCount();
            }
        };
        ChatEventBus.on("updateChatBoxMessage", handleChatBoxMsg);
        return () => ChatEventBus.off("updateChatBoxMessage", handleChatBoxMsg);
    }, [friend?.id]);

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
            addMessage(user.id, inputValue, msg.msgType);
            setInputValue("");
        }
    };
    // 只是当前用户自己发送信息进行的处理
    const addMessage = (id, content, msgType) => {
        console.log(`[${user.nickname}] 当前发送的消息列表：`, messages)
        setMessages(prevMessages => [
            ...prevMessages,
            { senderId: id, content: content.trim(), msgType: msgType }
        ]);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }
    // 输入表情
    const addEmoji = (data, e) => {
        let emoji = data.native
        setInputValue(inputValue + emoji);
    };
    const emojiSelect = <Picker data={data} onEmojiSelect={addEmoji}/>

    useEffect(() => {
        if (activeChat?.id) {
            clearUnreadCount();
        }
    }, [activeChat]);
    // 更新未读数都为0
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


    // 设置消息已读
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

    // 用于控制headerRight
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
                <span style={{height: "1px", backgroundColor: '#f0f0f0', width: '90%', display: 'inline-block'}}></span>
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

    return (
        <div className={styles.chatContainer}>
            {/*头部信息*/}
            <div className={styles.chatHeader}>
                <div className={styles.headerLeft}>
                    <Avatar src={friend?.avatar} size={40} style={{marginRight: '16px'}}/>
                    <div style={{marginBottom: '-5px'}}>
                        <h2 className={styles.nickname}>{friend?.nickname}</h2>
                        <small className={styles.status}>
                            <i>writing...</i>
                        </small>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <Tooltip title={"语音通话"} className={`${styles.headerAction} ${styles.chatBtn}`}>
                        <PhoneOutlined className={styles.iconBtn}/>
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
                                    <Avatar src={friend?.avatar} size={36} className={styles.msgAvatarLeft} />
                                    <MessageContent message={msg}/>
                                </>
                            ) : (
                                <>
                                    <MessageContent message={msg} />
                                    <Avatar src={user?.avatar} size={36} className={styles.msgAvatarRight} />
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
                            <Button icon={<SmileOutlined/>} className={styles.emojiBtn}/>
                        </Popover>
                    </div>
                    <Input
                        className={styles.inputBox}
                        placeholder="输入消息..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}/>
                     <div className={styles.sendBtns}>
                         <Button icon={<PaperClipOutlined />} className={styles.sendBtn} onClick={handleSend}/>
                         <Button icon={<AudioOutlined/>} className={styles.sendBtn} onClick={handleSend}/>
                         <Button type={"primary"} icon={<SendOutlined/>} className={styles.sendBtn} onClick={handleSend}/>
                     </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBox
