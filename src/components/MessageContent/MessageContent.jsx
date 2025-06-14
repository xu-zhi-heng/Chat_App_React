import React from 'react';
import styles from "./MessageContent.module.css"
import VoiceMessage from "../VoiceMessage/VoiceMessage";
import CallMessage from "../CallMessage/CallMessage";

const MessageContent = ({message}) => {
    const { msgType, content } = message;
    switch (msgType) {
        case 'TEXT':
            return <div className={styles.messageBubble}>{content}</div>
        case 'IMAGE':
            return (
                <div className={styles.messageImage}>
                    <img src={content} alt="图片消息" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
            );
        case 'VOICE':
            return <VoiceMessage url={content} duration={60} isSelf={false} />;
        case "PHONE":
        case 'VIDEO':
            return <CallMessage
                callType={'VIDEO'}
                connected={true}
                duration={75}
            />;
        default:
            return <div className="message-unknown">[未知消息类型]</div>;
    }
};

export default MessageContent


