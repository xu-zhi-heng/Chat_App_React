import React, {useState} from 'react';
import { Layout, Tooltip } from "antd";
import "../../assets/css/toolSidebar.css"

import {
    UserOutlined,
    MessageOutlined,
    SettingOutlined,
    LogoutOutlined,
    PhoneOutlined
} from "@ant-design/icons";
import AvatarMenu from "./AvatarMenu";
import ThemeToggle from "./ThemeToggle";

const { Sider } = Layout

const ToolSideBar = ({onMenuSelect, onLogout, onThemeToggle}) => {

    const [selectedKey, setSelectedKey] = useState("1")

    const handleMenuClick = (key, route) => {
        setSelectedKey(key)
        onMenuSelect(route)
    }

    const items = [
        {
            key: "1",
            icon: <MessageOutlined style={{ fontSize: "20px" }} />,
            tooltip: "消息",
            route: "/chat",
        },
        {
            key: "2",
            icon: <UserOutlined style={{ fontSize: "20px" }} />,
            tooltip: "好友",
            route: "/friend",
        },
        {
            key: "3",
            icon: <PhoneOutlined style={{ fontSize: "20px" }} />,
            tooltip: "电话",
            route: "/call",
        },
        {
            key: "4",
            icon: <SettingOutlined style={{ fontSize: "20px" }} />,
            tooltip: "设置",
            route: "/setting",
        },
    ];

    return (
        <Sider width={80} className="sidebar">
            <div>
                {/* ✅ 用户头像菜单 */}
                <AvatarMenu />

                {/* ✅ 中间菜单栏 */}
                <div className="menu-container">
                    {items.map((item) => (
                        <Tooltip key={item.key} title={item.tooltip} placement="right">
                            <div
                                className={`menu-item ${selectedKey === item.key ? "active" : ""}`}
                                onClick={() => handleMenuClick(item.key, item.route)}
                            >
                                {item.icon}
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </div>
            {/* 底部功能 */}
            <div className="bottom-icons">
                <ThemeToggle onToggle={onThemeToggle} />
                <LogoutOutlined
                    className="bottom-icon"
                    onClick={onLogout}
                    title="退出登录"
                />
            </div>
        </Sider>
    )
}

export default ToolSideBar
