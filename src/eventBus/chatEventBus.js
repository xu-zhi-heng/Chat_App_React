// chatEventBus.js
const listeners = {};

export const ChatEventBus = {
    // 监听事件
    on(eventName, callback) {
        if (!listeners[eventName]) listeners[eventName] = [];
        listeners[eventName].push(callback);
        return () => this.off(eventName, callback); // 返回卸载函数
    },

    // 触发事件
    emit(eventName, payload) {
        if (listeners[eventName]) {
            listeners[eventName].forEach(callback => callback(payload));
        }
    },

    // 移除事件
    off(eventName, callback) {
        if (listeners[eventName]) {
            listeners[eventName] = listeners[eventName].filter(
                cb => cb !== callback
            );
        }
    }
};
