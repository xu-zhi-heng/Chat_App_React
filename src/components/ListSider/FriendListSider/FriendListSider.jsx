import React, {useEffect, useState} from "react";
import {Input, List, Avatar, Badge, Tooltip} from "antd";
import styles from "./FriendListSider.module.css";
import commonStyles from "../../../assets/css/common.module.css"
import {getFriendList} from "../../../api/friend";
import {CloseCircleOutlined, UserAddOutlined} from "@ant-design/icons";

const FriendListSider = ({showFriendInfo}) => {
    const [friendList, setFriendList] = useState([])
    useEffect(() => {
        getFriendList(1).then(res => {
            if (res.code === 200) {
                setFriendList(res.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const actionList = [
        {key: "4", icon: <UserAddOutlined className={`${commonStyles.actionIcon}`}/>, tooltip: "添加好友"},
        {key: "3", icon: <CloseCircleOutlined className={`${commonStyles.actionIcon}`}/>, tooltip: "关闭"},
    ];

    return (
        <div className={commonStyles.listContainer}>
            <header className={commonStyles.header}>
                <span className={commonStyles.pageTitle}>我的好友</span>
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
                    className={styles.friendList}
                    dataSource={friendList}
                    renderItem={(item) => (
                        <List.Item className={styles.listItem} onClick={() => showFriendInfo(item.friendId)}>
                            <div className={styles.avatarContainer}>
                                <Badge
                                    dot
                                    offset={[-4, 36]}
                                    status={item.isOnline ? "success" : "default"}
                                >
                                    <Avatar src={item.avatar} size={50} />
                                </Badge>
                            </div>
                            <div className={styles.contentContainer}>
                                <div className={styles.friendName}>{item.nickname}</div>
                                <div className={styles.friendStatus}>{item.signature}</div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default FriendListSider;
