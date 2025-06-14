import { VideoCameraOutlined, AudioOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
};

const CallMessage = ({ callType, connected, duration }) => {
    const isVideo = callType === 'video';
    const IconComponent = isVideo ? VideoCameraOutlined : AudioOutlined;
    const label = connected
        ? `通话时长 ${formatDuration(duration)}`
        : '未接通';

    return (
        <div className="message-call" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: '#e6e6e6',
            padding: '10px 20px',
            borderRadius: '7px',
            maxWidth: '80%',
        }}>
            <IconComponent style={{ fontSize: '13px', marginRight: '8px' }} />
            <span>{label}</span>
        </div>
    );
};

export default CallMessage
