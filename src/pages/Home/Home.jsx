import React, {useEffect, useState, useRef} from 'react';
import { Layout, message, Typography } from "antd";
import ToolSideBar from "../../components/SidebarNav/ToolSideBar/ToolSideBar";
import {useNavigate} from 'react-router-dom'
import ChatListSider from "../../components/ListSider/ChatListSider/ChatListSider";
import FriendListSider from "../../components/ListSider/FriendListSider/FriendListSider";
import CallListSider from "../../components/ListSider/CallListSider/CallListSider";
import Setting from "../../components/ListSider/SettingSider/Setting";
import ChatBox from "../../components/ChatBox/ChatBox";
import {getUserInfo} from "../../api/auth";
import UserInfoDetail from "../../components/UserInfoDetail/UserInfoDetail";
import {getFriendDetailInfo} from "../../api/friend";
import {createChatList} from "../../api/chatList";
import styles from "./Home.module.css"
import {ChatEventBus} from "../../eventBus/chatEventBus";
import WebSocketService from '../../utils/WebSocketService';

const Home = () => {
    const {Content, Sider} = Layout
    const navigate = useNavigate()

    const [theme, setTheme] = useState("dark")
    const handleThemeToggle = (theme) => {
        setTheme(theme)
    }

    const [isShowChatBox, setIsShowChatBox] = useState(false)
    const handleClose = () => {
        setIsShowChatBox(false)
    }

    const [activeMenu, setActiveMenu] = useState("/chat")
    const handleMenuSelect = (route) => {
        if (route !== '/chat') {
            setIsShowChatBox(false)
        }
        setActiveMenu(route)
    }
    const renderContent = () => {
        switch (activeMenu) {
            case "/chat": return <ChatListSider user={currentUser} activeChat={activeChat} ref={chatListRef}
                                                onSelectChat={(chat) => onSelectChat(chat)}/>
            case "/friend": return <FriendListSider getFriendInfo={showFriendInfo} onSendMessage={onSendMessage}
                                                    showFriendInfo={controllerUserInfoSider}/>
            case "/call": return <CallListSider/>
            case "/setting": return <Setting/>
        }
    }
    const [currentUser, setCurrentUser] = useState(null);
    const [activeChat, setActiveChat] = useState(null)
    const chatListRef = useRef();
    const refreshChatList = () => {
        if (chatListRef.current) {
            chatListRef.current.getChatList();
        }
    }

    useEffect(() => {
        // 获取用户信息
        getUserInfo().then(res => {
            if (res.code === 200) {
                setCurrentUser(res.data)
                document.title = res.data.nickname;
            } else {
                message.error(res.desc)
            }
        })
    }, [])

    useEffect(() => {
        if (activeChat) {
            console.log("✅ activeChat 已经更新成功:", activeChat);
        } else {
            console.log("⚠️ activeChat 被设置为 null");
        }
    }, [activeChat]);

    const onSelectChat = async (chat) => {
        setActiveChat(chat);
        setIsShowChatBox(true);
        await getFriendInfo(chat.friendId);
    };

    useEffect(() => {
        if (currentUser?.id) {
            WebSocketService.connect(currentUser.id);
        }
    }, [currentUser?.id]);
    useEffect(() => {
        // 处理 websocket 接收到的消息
        const handleMessage = (message) => {
            console.log("接受到消息:" + JSON.stringify(message))
            if (activeMenu === '/chat') {
                const currentOpenChatUserId = getCurrentOpenChatUserId();
                // TODO: 可以先把消息 push 到一个临时队列，等 activeChat 准备好再 dispatch, 不知道是不是因为浏览器tab切换的原因
                // if (!currentOpenChatUserId) {
                //     console.warn("activeChat 还没准备好，消息先存缓存");
                // }
                if (isShowChatBox) {
                    if (message.senderId === currentOpenChatUserId) {
                        // 正在和对方聊天 -> 更新消息框
                        ChatEventBus.emit("updateChatBoxMessage", message);
                    } else {
                        // 如果接受的消息不是正在输入的消息类型就更新未读数
                        if (message.msgType !== 'TYPING') {
                            // 没有和对方聊天 -> 更新未读数
                            increaseUnreadCount(true, 1);
                        }
                    }
                } else {
                    // 说明没有聊天列表, 更新消息列表
                    refreshChatList()
                }
            } else {
                increaseUnreadCount(true, 1);
            }
        };
        WebSocketService.addMessageListener(handleMessage);
        return () => WebSocketService.removeMessageListener(handleMessage);
        /**
         * 没有加上activeChat会出现闭包陷阱
         * handleMessage 函数内部引用的 currentOpenChatUserId（基于 activeChat 计算）会形成闭包，始终保持初始值（可能为 null）
         即使后续 activeChat 发生变化（比如默认选中了第一个对话），handleMessage 也无法感知到这个变化，
         仍然会认为 currentOpenChatUserId 为空
         */
    }, [currentUser?.id, activeChat]);

    // 统一未读数更新
    const increaseUnreadCount = (flag, num) => {
        ChatEventBus.emit("updateAllUnReadMsgNum", {
            flag: flag,
            num: num
        });
    };

    // 获取当前聊天对话框的用户id
    const getCurrentOpenChatUserId = () => {
        if (activeChat !== null) {
            return activeChat.friendId
        }
        return null
    }

    // 获取好友信息
    const [currentFriend, setCurrentFriend] = useState(null)
    const getFriendInfo = async (friendId) => {
        if (currentFriend == null || currentFriend?.friendId !== friendId) {
            try {
                const res = await getFriendDetailInfo(friendId);
                if (res.code === 200) {
                    setCurrentFriend(res.data);
                    return res.data;
                } else {
                    message.error(res.desc);
                    return null;
                }
            } catch (err) {
                console.log(err);
                return null;
            }
        }
        return currentFriend;
    }

    const showFriendInfo = async (friendId) => {
        await getFriendInfo(friendId)
    }

    // 创建聊天
    const onSendMessage = async (data) => {
        let chatList = null
        if (data !== null) {
            chatList = data
        } else {
            chatList = {
                userId: currentUser.id,
                friendId: currentFriend.id,
            }
        }
        // 创建消息列表
        createChatList(chatList).then(async (res) => {
            if (res.code === 200) {
                if (activeChat == null || (res.data.id !== activeChat.id)) {
                    setActiveChat(res.data)
                }
                setIsShowChatBox(true);
                setActiveMenu("/chat");
            }
        }).catch(err => {
            console.log(err)
        })
    };

    // 打电话
    const onCall = () => {

    }
    // 删除好友
    const onDelete = () => {

    }

    // 控制显示好友信息的面板
    const [userInfoSideWidth, setUserInfoSideWith] = useState(350)
    const controllerUserInfoSider = () => {
        if (userInfoSideWidth === 0) {
            setUserInfoSideWith(350)
        } else {
            setUserInfoSideWith(0)
        }
    }

    const handleLogout = () => {
        message.success("退出成功！");
        sessionStorage.removeItem("sweet_fun_token");
        navigate("/login")
    }

    return (
        <Layout className={styles.container}>
            <Sider width={100} className={styles.navSider}>
                <ToolSideBar
                    activeRoute={activeMenu}
                    onMenuSelect={handleMenuSelect}
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    userInfo={currentUser}
                />
            </Sider>

            <Sider width={350} className={styles.listSider}>
                {renderContent()}
            </Sider>

            <Content className={styles.chatContent}>
                {
                    isShowChatBox ?
                        <ChatBox user={currentUser}
                                 activeChat={activeChat}
                                 onClose={handleClose}
                                 friend={currentFriend}
                                 onCloseUserInfo={controllerUserInfoSider}/>
                        :
                        <div className={styles.noChatBox}>
                            选择对话列表或开始第一次对话
                        </div>
                }
            </Content>

            <Sider width={userInfoSideWidth} className={styles.userInfoSider}>
                <UserInfoDetail friend={currentFriend}
                                onDelete={onDelete}
                                onCall={onCall}
                                onSendMessage={onSendMessage}
                                onClose={controllerUserInfoSider}/>
            </Sider>

        </Layout>
    )
}

export default Home
