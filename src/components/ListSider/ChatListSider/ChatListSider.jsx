import React, {useEffect, useState} from "react";
import {Input, List, Avatar, message, Tooltip, Badge} from "antd";
import styles from "./ChatListSider.module.css";
import commonStyles from "../../../assets/css/common.module.css"
import {getAllChatList} from "../../../api/chatList";
import {
    UsergroupAddOutlined,
    CommentOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
const ChatListSider = ({getMessageHistory, activeChat, user, setActiveChat}) => {
    const [messageList, setMessageList] = useState([])
    useEffect(() => {
        if (user == null || !user.id) {
            return
        }
        getMessageList()
    }, [user])
    const getMessageList = () => {
        getAllChatList(user?.id).then(res => {
            if (res.code === 200) {
                setMessageList(res.data)
                if (res.data.length > 0) {
                    setActiveChat(res.data[0].friendId)
                }
            } else {
                message.error(res.desc)
            }
        }).catch(err => {
            console.log(err)
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
                                // onClick={}
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
                    dataSource={messageList}
                    renderItem={(item) => (
                        <List.Item
                            className={`${styles.listItem} ${activeChat?.id === item.friendId ? 'active' : ''}`}
                            onClick={() => {
                                getMessageHistory(item.friendId);
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
                                    <Badge count={25} color={'#0a80ff'} showZero/>
                                    <div className={styles.msgTime}>03:41 PM</div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default ChatListSider;
