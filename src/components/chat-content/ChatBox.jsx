import React, { useState, useEffect, useRef } from "react";
import { Avatar, Input, Button, Tooltip } from "antd";
import { SendOutlined, MoreOutlined, CloseOutlined } from "@ant-design/icons";
import "../../assets/css/ChatBox.css"
const ChatBox = ({user, messages, onSend, onClose}) => {

    const [inputValue, setInputValue] = useState("")
    const messageEndRef = useRef(null)


    // 自动滚动到最新消息
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])


    const handleSend = () => {
        if (inputValue.trim()) {
            onSend(inputValue)
            setInputValue("")
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    return (
        <div className={"chat-container"}>
            {/*头部信息*/}
            <div className={"chat-header"}>
                <div className={"header-left"}>
                    <Avatar src={user?.avatar} size={40}/>
                    <span className={"nickname"}>{user?.nickname}</span>
                </div>
                <div className={"header-right"}>
                    <Tooltip title={"更多操作"}>
                        <MoreOutlined className={"icon-btn"}/>
                    </Tooltip>
                    <Tooltip title={"关闭"}>
                        <CloseOutlined className={"icon-btn"} onClick={onClose}/>
                    </Tooltip>
                </div>
            </div>

            {/*中间聊天区*/}
            <div className={"chat-content"}>
                {messages?.map((msg, index) => (
                    <div key={index} className={`message-item ${msg.sender === user?.id ? 'right' : 'left'}`}>
                        {msg.sender !== user?.id ? (
                            <>
                                <Avatar src={msg.avatar} size={30} className={"msg-avatar-left"} />
                                <div className={"message-bubble"}>{msg.content}</div>
                            </>
                        ) : (
                            <>
                                <div className={"message-bubble"}>{msg.content}</div>
                                <Avatar src={msg.avatar} size={30} className={"msg-avatar-right"} />
                            </>
                        )}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            {/*底部输入框*/}
            <div className={"chat-footer"}>
                <Input
                    className={"input-box"}
                    placeholder="输入消息..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}/>
                <Button type={"primary"} icon={<SendOutlined/>} className={"send-btn"} onClick={handleSend}>
                    发送
                </Button>
            </div>

        </div>
    )
}

export default ChatBox
