import React, { useState } from 'react';
import { BulbOutlined } from "@ant-design/icons";
import "../../assets/css/toolSidebar.css";

const ThemeToggle = ({onToggle}) => {
    const [isDark, setIsDark] = useState(true);

    const handleToggle = () => {
        setIsDark(!isDark);
        onToggle(isDark ? "light" : "dark")
    }

    return (
        <BulbOutlined
            className="bottom-icon"
            onClick={handleToggle}
            title={isDark ? "切换到亮色" : "切换到暗色"}
        />
    )
}

export default ThemeToggle

