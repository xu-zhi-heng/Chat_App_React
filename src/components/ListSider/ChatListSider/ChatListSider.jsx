import React, {useEffect, useRef, useState, forwardRef, useImperativeHandle} from "react";
import {Input, List, Avatar, message, Tooltip, Badge, Dropdown, Space, Menu} from "antd";
import styles from "./ChatListSider.module.css";
import commonStyles from "../../../assets/css/common.module.css"
import {getAllChatList, updateChatList} from "../../../api/chatList";
import {
    UsergroupAddOutlined,
    CommentOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import { ChatEventBus } from '../../../eventBus/chatEventBus';

const ChatListSider = forwardRef(({user, activeChat, onSelectChat}, ref) => {
    const [chatList, setChatList] = useState([])
    useEffect(() => {
        if (user == null || !user.id) {
            return
        }
        getChatList()
    }, [user])
    // 获取聊天列表
    const getChatList = () => {
        getAllChatList(user?.id).then(res => {
            if (res.code === 200) {
                setChatList(res.data)
                if (res.data.length > 0 && !activeChat) {
                    // 仅在 activeChat 为空时才默认选第一个
                    const chat = res.data[0]
                    onSelectChat(chat)
                    if (parseInt(chat.unreadCount) !== 0) {
                        readMessage(chat.id)
                        ChatEventBus.emit("updateAllUnReadMsgNum", {
                            flag: false,
                            num: parseInt(chat.unreadCount)
                        })
                        chat.unreadCount = 0
                    }
                }
            } else {
                message.error(res.desc)
            }
        }).catch(err => {
            console.log(err)
        })
    }
    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        getChatList
    }));
    const handleSelectChat = (chat) => {
        onSelectChat(chat)
        if (parseInt(chat.unreadCount) !== 0) {
            readMessage(chat.id)
            ChatEventBus.emit("updateAllUnReadMsgNum", {
                flag: false,
                num: parseInt(chat.unreadCount)
            })
        }
    };
    useEffect(() => {
        const removeChat = ChatEventBus.on('removeChat', (data) => {
            const updatedList = chatList.filter(item => item.id !== data.chatId);
            setChatList(updatedList);
        });
        // 组件卸载时取消订阅
        return removeChat;
    }, [])

    // 表示阅读了消息，将消息未读数设置为0
    const readMessage = (chatListId) => {
        let body = { id: chatListId, unreadCount: 0 };
        updateChatList(body).then(res => {
            if (res.code === 200) {
                setChatList(prevList =>
                    prevList.map(item =>
                        item.id === chatListId ? { ...item, unreadCount: 0 } : item
                    )
                );
            } else {
                message.error(res.desc);
            }
        }).catch(err => {
            console.log(err);
        })
    }


    const actionList = [
        { key: "1", icon: <UsergroupAddOutlined className={commonStyles.actionIcon}/>, tooltip: "创建群组" },
        { key: "2", icon: <CommentOutlined className={commonStyles.actionIcon}/>, tooltip: "新的聊天" },
        { key: "3", icon: <CloseCircleOutlined className={`${commonStyles.actionIcon}`}/>, tooltip: "关闭" },
    ];

    return (
        <div className={commonStyles.listContainer}>
            <header className={commonStyles.header}>
                <span className={commonStyles.pageTitle}>消息列表</span>
                <div className={commonStyles.listLine}>
                    {actionList.map((item) => (
                        <Tooltip key={item.key} title={item.tooltip} placement="bottom">
                            <div
                                className={`${commonStyles.listLineItem} 
                                            ${item.key === '3' ? commonStyles.visibility : ''}`}
                            >
                                {item.icon}
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </header>
            <div className={commonStyles.searchBoxContainer}>
                <Input
                    placeholder="搜索消息..."
                    className={commonStyles.searchBox}
                />
            </div>
            <div className={styles.listBody}>
                <List
                    className={styles.chatList}
                    dataSource={chatList}
                    renderItem={(item) => (
                        <List.Item
                            className={`${styles.listItem} ${activeChat?.id === item.id ? styles.active : ''}`}
                            onClick={() => {
                                handleSelectChat(item)
                            }}
                        >
                            <div className={styles.avatarContainer}>
                                <Avatar src={item.avatar} size={40} />
                            </div>
                            <div className={styles.contentContainer}>
                                <div className={styles.messageContent}>
                                    <div className={styles.chatName}>{item.nickName}</div>
                                    <div className={styles.chatMessage}>
                                        {item.content == null ? "暂无消息" : item.content}
                                    </div>
                                </div>
                                <div className={styles.noticeContent}>
                                    {parseInt(item.unreadCount) === 0 ? (
                                        <div style={{paddingTop: "20px"}}></div>
                                    ) : (
                                        <Badge count={parseInt(item.unreadCount)} color={'#0a80ff'} showZero={false} title={"未读消息数"} />
                                    )}
                                    <div className={styles.msgTime}>{item.lastMessageTime}</div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
});

export default ChatListSider;
