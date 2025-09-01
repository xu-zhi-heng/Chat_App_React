import React, {useEffect, useState} from "react";
import { Avatar, Dropdown } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    EditOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import style from "./AvatarMenu.module.css"
import {getFilePresignedUrl} from "../../../api/file";
import {getRelImageUlr} from "../../../utils/relFileUrl";

const AvatarMenu = ({avatarUrl}) => {
    const [relAvatarUrl, setRelAvatarUrl] = useState(null)
    useEffect(() => {
        const loadImage = async () => {
            const url = await getRelImageUlr(avatarUrl);
            setRelAvatarUrl(url);
        };
        loadImage();
    }, [avatarUrl]);

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
            key: "editProfile",
            label: "修改个人信息",
            icon: <EditOutlined />,
        },
        {
            key: "settings",
            label: "设置",
            icon: <SettingOutlined />,
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
            trigger={["click"]}
            placement="topLeft"
            arrow={{ pointAtCenter: true }}
        >
            <div>
                <Avatar
                    size={40}
                    src={relAvatarUrl || undefined}
                    icon={!relAvatarUrl && <UserOutlined />}
                    className={style.avatar}
                />
            </div>
        </Dropdown>
    );
}

export default AvatarMenu;
