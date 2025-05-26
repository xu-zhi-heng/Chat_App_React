import React from "react";
import { Input, List, Avatar } from "antd";
import { callData } from "../../mockData/listData";
import "../../assets/css/CallList.css"; // ✅ 引入全局 CSS

const CallList = () => {
    return (
        <div className="page-container">
            <h2 className="page-title">📞 电话列表</h2>
            {/* 搜索框 */}
            <Input
                placeholder="搜索通话记录..."
                className="search-box"
                allowClear
            />

            {/* 电话记录列表 */}
            <List
                className="call-list"
                dataSource={callData}
                renderItem={(item) => (
                    <List.Item className="list-item">
                        {/* 左侧头像 */}
                        <div className="avatar-container">
                            <Avatar src={item.avatar} size={50} />
                        </div>

                        {/* 右侧内容 */}
                        <div className="content-container">
                            <div className="call-name">{item.name}</div>
                            <div className="call-time">{item.time}</div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default CallList;
