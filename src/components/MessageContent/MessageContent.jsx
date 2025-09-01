import React, { useState, useEffect } from 'react';
import styles from "./MessageContent.module.css"
import VoiceMessage from "../VoiceMessage/VoiceMessage";
import CallMessage from "../CallMessage/CallMessage";
import TextMessage from "../TextMessage/TextMessage";
import {formatDateByToday} from "../../utils/date";
import {getRelImageUlr} from "../../utils/relFileUrl";

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
    const [url, setUrl] = useState(null);
    useEffect(() => {
        const loadImage = async () => {
            const relUrl = await getRelImageUlr(content);
            setUrl(relUrl);
        };
        loadImage();
    }, [content]);

    switch (msgType) {
        case 'TEXT':
            return <TextMessage content={content} messageInfo={getMessageInfo()}/>
        case 'IMAGE':
            return (
                <div className={styles.messageImage}>
                    {url ? (
                        <img
                            src={url}
                            alt="图片消息"
                            style={{
                                maxWidth: '200px',
                                borderRadius: '8px',
                                maxHeight: '600px'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '200px',
                            height: '150px',
                            background: '#f0f0f0',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span>加载中...</span>
                        </div>
                    )}
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


