import React, { useState, useEffect, useRef } from "react";
import { Avatar, Input, Button, Tooltip, Popover } from "antd";
import {
    SendOutlined, MoreOutlined, PhoneOutlined,
    VideoCameraOutlined,SmileOutlined, PaperClipOutlined,AudioOutlined
} from "@ant-design/icons";
import styles from "./ChatBox.module.css"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import MessageContent from "../MessageContent/MessageContent";
const ChatBox = ({user, messages, onSend, onClose, friend}) => {
    const [inputValue, setInputValue] = useState("")
    const socketRef = useRef(null);
    const messageEndRef = useRef(null)
    // 自动滚动到最新消息
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])
    useEffect(() => {
        if (user && user.id) {
            linkToNettyChatServer();
        }
    }, [user]);
    const addEmoji = (data, e) => {
        let emoji = data.native
        setInputValue(inputValue + emoji);
    };
    const emojiSelect = <Picker data={data} onEmojiSelect={addEmoji}/>
    const handleSend = () => {
        if (inputValue.trim()) {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                const msg = {
                    msgType: 'TEXT',
                    senderId: user.id,
                    receiverId: friend.friendId,
                    content: inputValue.trim(),
                };
                socketRef.current.send(JSON.stringify(msg));
            } else {
                console.warn("WebSocket 未连接");
            }
            onSend({
                id: user.id,
                content: inputValue
            })
            setInputValue("")
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }
    // 连接到netty 聊天服务端
    const linkToNettyChatServer = () => {
        const ws = new WebSocket("ws://101.132.121.100:8082/chat");
        ws.onopen = () => {
            console.log("WebSocket 连接成功");
            if (user) {
                ws.send(JSON.stringify({ msgType: 'auth', userId: user.id }));
            }
        };
        ws.onmessage = (event) => {
            console.log("收到消息：", event.data);
            if (event.data !== '认证成功') {
                onSend({
                    id: friend.friendId,
                    content: event.data
                });
            }
        };
        ws.onerror = (error) => {
            console.error("WebSocket 错误", error);
        };
        ws.onclose = () => {
            console.warn("WebSocket 关闭");
        };
        socketRef.current = ws;
    };

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
                    <Tooltip title={"更多操作"} className={styles.headerAction}>
                        <MoreOutlined className={styles.iconBtn} />
                    </Tooltip>
                </div>
            </div>
            {/*中间聊天区*/}
            <div className={styles.chatContent}>
                <div className={styles.messageList}>
                    {messages?.map((msg, index) => (
                        <div key={index} className={`${styles.messageItem} ${msg.sender === user?.id ? 'right' : 'left'}`}>
                            {msg.sender !== user?.id ? (
                                <>
                                    <Avatar src={friend?.avatar} size={36} className={styles.msgAvatarLeft} />
                                    <MessageContent message={msg}/>
                                </>
                            ) : (
                                <>
                                    <MessageContent message={msg}/>
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
