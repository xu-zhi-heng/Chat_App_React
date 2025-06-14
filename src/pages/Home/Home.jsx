import React, {useEffect, useState} from 'react';
import { Layout, message, Typography } from "antd";
import ToolSideBar from "../../components/SidebarNav/ToolSideBar/ToolSideBar";
import {useNavigate} from 'react-router-dom'
import ChatListSider from "../../components/ListSider/ChatListSider/ChatListSider";
import FriendListSider from "../../components/ListSider/FriendListSider/FriendListSider";
import CallListSider from "../../components/ListSider/CallListSider/CallListSider";
import Setting from "../../components/ListSider/SettingSider/Setting";
import ChatBox from "../../components/ChatBox/ChatBox";
import {getUserInfo} from "../../api/auth";
import {getMessageListBetweenUsers} from "../../api/message";
import UserInfoDetail from "../../components/UserInfoDetail/UserInfoDetail";
import {getFriendDetailInfo} from "../../api/friend";
import {createChatList} from "../../api/chatList";
import styles from "./Home.module.css"

const Home = () => {
    const {Content, Sider} = Layout
    const navigate = useNavigate()

    const [theme, setTheme] = useState("dark")
    const [activeList, setActiveList] = useState("/chat")

    const [currentUser, setCurrentUser] = useState(null);
    const [currentFriend, setCurrentFriend] = useState(null)
    const [isShowChatBox, setIsShowChatBox] = useState(true)

    useEffect(() => {
        getUserInfo().then(res => {
            if (res.code === 200) {
                setCurrentUser(res.data)
                document.title = res.data.nickname;
            } else {
                message.error(res.desc)
            }
        })
    }, [])

    const handleThemeToggle = (theme) => {
        setTheme(theme)
    }

    const handleLogout = () => {
        message.success("退出成功！");
        sessionStorage.removeItem("sweet_fun_token");
        navigate("/login")
    }

    const handleMenuSelect = (route) => {
        setActiveList(route)
    }

    const renderContent = () => {
        switch (activeList) {
            case "/chat": return <ChatListSider getMessageHistory={getMessageHistory} activeChat={currentFriend} user={currentUser} setActiveChat={setActiveChat}/>
            case "/friend": return <FriendListSider showFriendInfo={showFriendInfo}/>
            case "/call": return <CallListSider/>
            case "/setting": return <Setting/>
        }
    }

    const [messages, setMessages] = useState([]);

    // 获取两个用户之间的对话历史记录
    const getMessageHistory = async (friendId, isSendMessage = false) => {
        if ((currentFriend == null || currentFriend?.id != friendId) || isSendMessage) {
            const friendInfo = await getFriendInfo(friendId);
            if (!friendInfo) {
                setCurrentFriend(null);
                return;
            }
            let time = Date.now();
            return getMessageListBetweenUsers(currentUser.id, friendId, time)
                .then(res => {
                    if (res.code === 200) {
                        setMessages(res.data);
                    } else {
                        message.error(res.desc);
                    }
                })
                .catch(err => {
                    console.log(err);
                    setCurrentFriend(null);
                });
        }
    }

    const handleMessage = (msg) => {
        setMessages([
            ...messages,
            {sender: msg.id, content: msg.content}
        ])
    }

    const handleClose = () => {

    }

    const setActiveChat = async (friendId) => {
        await getMessageHistory(friendId)
    }
    const showFriendInfo = async (friendId) => {
        setIsShowChatBox(false)
        await getFriendInfo(friendId)
    }
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

    // 发送信息
    const onSendMessage = async () => {
        let chatList = {
            userId: currentUser.id,
            friendId: currentFriend.id,
        }
        // 创建消息列表
        createChatList(chatList).then(async (res) => {
            if (res.code === 200) {
                await getMessageHistory(currentFriend.id, true)
                setIsShowChatBox(true);
                setActiveList("/chat");
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

    const [userInfoSideWidth, setUserInfoSideWith] = useState(350)
    const closeUserInfoSider = () => {
        setUserInfoSideWith(0)
    }

    return (
        <Layout className={styles.container}>
            <Sider width={100} className={styles.navSider}>
                <ToolSideBar
                    activeRoute={activeList}
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
                <ChatBox user={currentUser} messages={messages} onSend={handleMessage} onClose={handleClose} friend={currentFriend}/>
            </Content>

            <Sider width={userInfoSideWidth} className={styles.userInfoSider}>
                <UserInfoDetail friend={currentFriend} onDelete={onDelete} onCall={onCall} onSendMessage={onSendMessage} onClose={closeUserInfoSider}/>
            </Sider>

        </Layout>
    )
}

export default Home
