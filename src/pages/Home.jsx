import React, {useEffect, useState} from 'react';
import { Layout, message } from "antd";
import ToolSideBar from "../components/toolSideBar/ToolSideBar";
import {useNavigate} from 'react-router-dom'
import "../assets/css/home.css"
import ChatList from "../components/listSideBar/ChatList";
import FriendList from "../components/listSideBar/FriendList";
import CallList from "../components/listSideBar/CallList";
import Setting from "../components/listSideBar/Setting";
import ChatBox from "../components/chat-content/ChatBox";
// 这里到时候会替换掉
import image1 from '../assets/image/20171122191532_f2975b.jpg'
import image2 from '../assets/image/20171123181522_c48800.jpg'
import {getUserInfo} from "../api/auth";

const Home = () => {

    const {Content, Sider} = Layout

    const navigate = useNavigate()

    const [theme, setTheme] = useState("dark")
    const [activeList, setActiveList] = useState("/chat")

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        getUserInfo().then(res => {
            if (res.code === 200) {
                setCurrentUser(res.data)
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
        localStorage.removeItem("mini_chat_token");
        navigate("/login")
    }

    const handleMenuSelect = (route) => {
        setActiveList(route)
    }

    const renderContent = () => {
        switch (activeList) {
            case "/chat": return <ChatList/>
            case "/friend": return <FriendList/>
            case "/call": return <CallList/>
            case "/setting": return <Setting/>
        }
    }

    const [messages, setMessages] = useState([
        { sender: 1, content: "你好！", avatar: image1 },
        { sender: 2, content: "你好，请问有什么问题？", avatar: image2 },
    ]);

    const handleSendMessage = (msg) => {
        setMessages([
            ...messages,
            {sender: currentUser.id, content: msg, avatar: currentUser.avatar}
        ])
        // todo 存入数据库
    }

    const handleClose = () => {
        console.log()
    }

    return (
        <Layout className={"chat-container"} style={{height: '100vh'}}>
            <ToolSideBar
                onThemeToggle={handleThemeToggle}
                onLogout={handleLogout}
                onMenuSelect={handleMenuSelect}
            />
            <Layout className={"list-container"}>
                <Content className={"list-content"}>
                    {renderContent()}
                </Content>
                <Sider className={"chatbox-sider"} width={850}>
                    <ChatBox user={currentUser} messages={messages} onSend={handleSendMessage} onClose={handleClose}/>
                </Sider>
            </Layout>
        </Layout>
    )
}

export default Home
