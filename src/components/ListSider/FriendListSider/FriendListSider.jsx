import React, {useEffect, useRef, useState} from "react";
import {Input, List, Avatar, Badge, Tooltip, Dropdown, Space, message} from "antd";
import styles from "./FriendListSider.module.css";
import commonStyles from "../../../assets/css/common.module.css"
import {getFriendList} from "../../../api/friend";
import {
    CloseCircleOutlined, DeleteOutlined,
    MenuOutlined,
    UserAddOutlined,
    UserOutlined,
    MessageOutlined,
    BellFilled
} from "@ant-design/icons";

const FriendListSider = ({getFriendInfo, onSendMessage, showFriendInfo}) => {
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

    const [chooseFriend, setChooseFriend] = useState(null)

    const actionList = [
        {key: "4", icon: <UserAddOutlined className={`${commonStyles.actionIcon}`}/>, tooltip: "添加好友"},
        {key: "3", icon: <CloseCircleOutlined className={`${commonStyles.actionIcon}`}/>, tooltip: "关闭"},
    ];

    const moreActionItems = [
        {
            key: '1',
            label: (
                <div>
                    <UserOutlined style={{ marginRight: 8 }} />
                    好友信息
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div>
                    <MessageOutlined style={{ marginRight: 8 }} />
                    发起聊天
                </div>
            )
        },
        {
            key: '3',
            label: (
                <div>
                    <BellFilled style={{ marginRight: 8 }} />
                    屏蔽信息
                </div>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: '4',
            danger: true,
            label: (
                <div>
                    <DeleteOutlined style={{ marginRight: 8 }} />
                    删除好友
                </div>
            ),
        },
    ];
    const handleSendMessage = () => {
        if (chooseFriend == null) {
            return
        }
        let data = {
            userId: chooseFriend.userId,
            friendId: chooseFriend.friendId
        }
        onSendMessage(data)
    }
    const handleBlockMessage = () => {
        console.log("屏蔽信息")
    }
    const handleFriendInfo = () => {
        getFriendInfo(chooseFriend.friendId)
        showFriendInfo()
    }
    const handleActionDict = {
        "1": handleFriendInfo,
        "2": handleSendMessage,
        "3": handleBlockMessage,
        "4": null
    }
    const moreActionIconRef = useRef(null)
    // 更多操作的点击事件
    const handleMoreAction = ({ key }) => {
        if (handleActionDict[key] !== null) {
            handleActionDict[key]()
        }
    };
    const clickMoreActionIcon = (item, e) => {
        e.stopPropagation();
        setChooseFriend(item);
    };

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
                        <List.Item className={styles.listItem} onClick={() => getFriendInfo(item.friendId)}>
                            <div className={styles.avatarContainer}>
                                <Badge
                                    dot
                                    offset={[-4, 40]}
                                    status={item.isOnline ? "success" : "default"}
                                >
                                    <Avatar src={item.avatar} size={50} />
                                </Badge>
                            </div>
                            <div className={styles.contentContainer}>
                                <div className={styles.friendName}>{item.nickname}</div>
                                <div className={styles.friendStatus}>{item.signature}</div>
                            </div>
                            <div className={styles.moreAction}>
                                <Dropdown menu={{ items: moreActionItems, onClick: handleMoreAction }}
                                          trigger={['click']}
                                          mouseEnterDelay={0.1}
                                          mouseLeaveDelay={0.3} >
                                    <Space onClick={(e) => clickMoreActionIcon(item, e)}>
                                        <MenuOutlined ref={moreActionIconRef} />
                                    </Space>
                                </Dropdown>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default FriendListSider;
