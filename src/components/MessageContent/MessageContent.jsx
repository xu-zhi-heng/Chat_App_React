import React, { useState, useEffect } from 'react';
import styles from "./MessageContent.module.css"
import VoiceMessage from "../VoiceMessage/VoiceMessage";
import CallMessage from "../CallMessage/CallMessage";
import TextMessage from "../TextMessage/TextMessage";
import {formatDateByToday} from "../../utils/date";
import {getFilePresignedUrl} from "../../api/file";

const MessageContent = ({message, user, friend}) => {
    const getMessageInfo = () => {
        let info = {}
        if (message.senderId === user.id) {
            info['isMe'] = true
            info['nickName'] = user.nickname
        } else {
            info['isMe'] = false
            info['nickName'] = friend.nickname
        }
        info['time'] = formatDateByToday(message.createTime)
        return info
    }
    const { msgType, content } = message;
    const [url, setUrl] = useState('https://thf.bing.com/th/id/OIP.2bip_3OHH5fdJbztzBefPwHaEt?w=237&h=180&c=7&r=0&o=7&cb=thfc1&dpr=1.3&pid=1.7&rm=3');
    useEffect(() => {
        getFilePresignedUrl(content)
            .then(res => {
                if (res.code === 200) {
                    setUrl(res.data);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, [content]);
    switch (msgType) {
        case 'TEXT':
            return <TextMessage content={content} messageInfo={getMessageInfo()}/>
        case 'IMAGE':
            return (
                <div className={styles.messageImage}>
                    <img src={url} alt="图片消息" style={{ maxWidth: '200px', borderRadius: '8px', maxHeight: '600px' }} />
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


