import React from "react";
import styles from "./TextMessage.module.css";

const TextMessage = ({ content, messageInfo }) => {
    return (
        <div className={`${styles.bubble} ${messageInfo?.isMe ? styles.me : styles.other}`}>
            <div className={styles.msgInfo}>
                <div className={styles.msgInfoName}>
                    {messageInfo.nickName}
                </div>
                <div className={styles.msgInfoTime}>
                    {messageInfo.time}
                </div>
            </div>
            <div className={styles.msgText}>
                {content}
            </div>
        </div>
    );
};

export default TextMessage;
