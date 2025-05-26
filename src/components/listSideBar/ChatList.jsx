import React from "react";
import { Input, List, Avatar } from "antd";
import { chatData } from "../../mockData/listData";
import "../../assets/css/ChatList.css";

const ChatList = () => {
    return (
        <div className="page-container">
            <h2 className="page-title">📩 消息列表</h2>

            {/* 搜索框 */}
            <Input
                placeholder="搜索消息..."
                className="search-box"
                allowClear
            />

            {/* 消息列表 */}
            <List
                className="chat-list"
                dataSource={chatData}
                renderItem={(item) => (
                    <List.Item className="list-item">
                        {/* 左侧头像 */}
                        <div className="avatar-container">
                            <Avatar src={item.avatar} size={50} />
                        </div>

                        {/* 右侧内容 */}
                        <div className="content-container">
                            <div className="chat-name">{item.name}</div>
                            <div className="chat-message">
                                {item.message}
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ChatList;
