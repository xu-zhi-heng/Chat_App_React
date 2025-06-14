import React from 'react';
import { Tooltip } from "antd";
import styles from "./ToolSidebar.module.css"
import {
    UserOutlined,
    MessageOutlined,
    SettingOutlined,
    PhoneOutlined
} from "@ant-design/icons";
import AvatarMenu from "../AvatarMenu/AvatarMenu";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import logoPng from "../../../assets/image/logo.png"

const ToolSideBar = ({ activeRoute, onMenuSelect, onLogout, onThemeToggle, userInfo }) => {
    const handleMenuClick = (key, route) => {
        onMenuSelect(route); // 通知父组件改变 activeRoute
    };

    const items = [
        { key: "1", icon: <MessageOutlined className={`${styles.icons}`}/>, tooltip: "消息", route: "/chat" },
        { key: "2", icon: <UserOutlined className={styles.icons}/>, tooltip: "好友", route: "/friend" },
        { key: "3", icon: <PhoneOutlined className={styles.icons}/>, tooltip: "电话", route: "/call" },
        { key: "4", icon: <SettingOutlined className={styles.icons} />, tooltip: "设置", route: "/setting" },
    ];

    // 找出当前 route 对应的 key
    const currentKey = items.find((item) => item.route === activeRoute)?.key;

    return (
        <div className={styles.sideBar}>
            <div>
                <div className={styles.logo}>
                    <img src={logoPng} alt="logo"/>
                </div>
                <div className={styles.menuContainer}>
                    {items.map((item) => (
                        <Tooltip key={item.key} title={item.tooltip} placement="right">
                            <div
                                className={`${styles.menuItem} ${currentKey === item.key ? styles.menuItemActive : ""}`}
                                onClick={() => handleMenuClick(item.key, item.route)}
                            >
                                {item.icon}
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </div>
            <div className={styles.bottomIcons}>
                <ThemeToggle onToggle={onThemeToggle} />
                <AvatarMenu avatarUrl={userInfo?.avatar}/>
            </div>
        </div>
    );
};

export default ToolSideBar
