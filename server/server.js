const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const cors = require('cors');

// 加载 .env 文件
dotenv.config();

// 初始化 express
const app = express();

// ✅ 连接 MySQL（已在 `db.js` 中通过连接池处理）
console.log('✅ 数据库连接成功');

// ✅ 设置跨域
app.use(
    cors({
        origin: '*', // 允许来自前端的请求
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);


// 中间件
app.use(express.json());

// ✅ 加载路由
app.use('/api', authRoutes);

// 启动服务
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
