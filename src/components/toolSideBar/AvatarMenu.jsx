import React from "react";
import "../../assets/css/toolSidebar.css";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AvatarMenu = () => {

    const handleMenuClick = (e) => {
        if (e.key === 'profile') {
            // todo 个人资料显示
        } else if (e.key === 'logout') {
            localStorage.removeItem("mini_chat_token")
            navigate("/login")
        }
    }

    const items = [
        {
            key: "profile",
            label: "个人资料",
            icon: <UserOutlined />,
        },
        {
            key: "logout",
            label: "退出登录",
            icon: <LogoutOutlined />,
            danger: true, // ✅ 退出按钮标红
        },
    ];

    const navigate = useNavigate();

    return (
        <Dropdown
            menu={{
                items,
                onClick: handleMenuClick,
            }}
            trigger={["hover"]}
            placement="bottom"
        >
            <div>
                <Avatar
                    size={48}
                    icon={<UserOutlined />}
                    className="avatar"
                    style={{ cursor: "pointer" }}
                />
            </div>
        </Dropdown>
    );
}

export default AvatarMenu;
