import React, { useState } from 'react';
import { BulbOutlined } from "@ant-design/icons";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = ({onToggle}) => {
    const [isDark, setIsDark] = useState(false);

    const handleToggle = () => {
        setIsDark(!isDark);
        onToggle(isDark ? "light" : "dark")
    }

    return (
        <BulbOutlined
            className={`${styles.themeToggleIcon} ${isDark ? styles.dark : styles.light}` }
            onClick={handleToggle}
            title={isDark ? "切换到亮色" : "切换到暗色"}
        />
    )
}

export default ThemeToggle

