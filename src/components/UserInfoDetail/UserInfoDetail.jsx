import React from "react";
import { Avatar, Button, Tabs} from "antd";
import { PhoneOutlined, MessageOutlined, DeleteOutlined, CloseOutlined  } from "@ant-design/icons";
import styles from "./UserInfoDetail.module.css";

const UserInfoDetail = ({ friend, onSendMessage, onCall, onDelete, onClose}) => {
    if (!friend) return null;

    const friendBasicInfo = <div className={styles.friendBasicInfo}>
        {friend.username && (
            <div>
                <strong>账号：</strong>
                <span>{friend.username}</span>
            </div>
        )}
        {friend.email && (
            <div>
                <strong>邮箱：</strong>
                <span>{friend.email}</span>
            </div>
        )}
        {friend.phone && (
            <div>
                <strong>手机：</strong>
                <span>{friend.phone}</span>
            </div>
        )}
        <div>
            <strong>签名：</strong>
            <span>{friend.signature || "这个人很神秘..."}</span>
        </div>
        <div>
            <strong>动态：</strong>
            <span>这是一条动态内容...</span>
        </div>
    </div>
    const items = [
        {
            label: `基本信息`,
            key: 1,
            children: friendBasicInfo,
        },
        {
            label: `消息文件`,
            key: 2,
            children: `消息文件`,
        }
    ]

    return (
        <div className={styles.friendDetailContainer}>
            <header className={styles.header}>
                <span className={styles.title}>用户信息</span>
                <Button icon={<CloseOutlined />} className={styles.closeBtn} onClick={onClose}/>
            </header>
            <div className={styles.friendInfo}>
                <div className={styles.infoWrapper}>
                    <div className={styles.avatarWrapper}>
                        <Avatar src={friend.avatar} size={96} />
                        <span className={`${styles.statusDot} ${friend.isOnline ? "online" : "offline"}`}/>
                    </div>
                    <h5 className={styles.nickName}>{friend.nickname}</h5>
                    <p className={styles.lastTime}>Last seen: Today</p>
                </div>
            </div>

            <Tabs
                defaultActiveKey="1"
                centered
                items={items}
            />

            <div className={styles.friendActions}>
                <Button type="primary" icon={<MessageOutlined />} onClick={onSendMessage}>
                    发消息
                </Button>
                <Button icon={<PhoneOutlined />}  onClick={onCall}>
                    打电话
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
                    删除好友
                </Button>
            </div>
        </div>
    );
};

export default UserInfoDetail;
