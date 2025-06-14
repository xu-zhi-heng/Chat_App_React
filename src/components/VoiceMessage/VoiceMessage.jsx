import React, { useRef, useState } from 'react';
import voiceIcon from "../../assets/image/voice-icon.png"
const VoiceMessage = ({ url, duration = 5, isSelf = false }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    return (
        <div
            onClick={togglePlay}
            className={`voice-bubble ${isSelf ? 'self' : 'other'}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '7px',
                backgroundColor: isSelf ? '#a0e75a' : '#e6e6e6',
                cursor: 'pointer',
                maxWidth: '60%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
        >
            {/* 图标图片 */}
            <img
                src={voiceIcon}
                alt="播放语音"
                style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                }}
            />

            <span>{duration}"</span>

            <audio
                ref={audioRef}
                src={url}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
            />
        </div>
    );
};

export default VoiceMessage
