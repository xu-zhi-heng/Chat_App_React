class WebSocketService {
    static instance = null;
    socket = null;
    listeners = new Set();

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    connect(userId) {
        if (this.socket) return;

        // this.socket = new WebSocket("ws://101.132.121.100:8082/chat");
        this.socket = new WebSocket("ws://127.0.0.1:8082/chat");

        this.socket.onopen = () => {
            console.log("WebSocket 连接成功");
            this.send({
                msgType: 'AUTH',
                senderId: userId
            });
        };

        this.socket.onmessage = (event) => {
            if (JSON.parse(event.data).msgType !== 'AUTH') {
                const message = JSON.parse(event.data);
                this.listeners.forEach(cb => cb(message));
            }
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket 错误", error);
        };

        this.socket.onclose = () => {
            console.warn("WebSocket 关闭");
            this.socket = null;
        };
    }

    send(message) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket 未连接");
        }
    }

    addMessageListener(callback) {
        this.listeners.add(callback);
    }

    removeMessageListener(callback) {
        this.listeners.delete(callback);
    }

    close() {
        this.socket?.close();
        this.socket = null;
    }
}

export default WebSocketService.getInstance();
