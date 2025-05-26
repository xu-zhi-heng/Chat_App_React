const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ 确保路径存在
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const avatarUploadPath = path.join(__dirname, '../files/avatars');

// ✅ 在存储前确保 `files/avatars` 目录存在
ensureDirectoryExists(avatarUploadPath);

// ✅ 设置文件存储路径
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureDirectoryExists(avatarUploadPath);
        cb(null, avatarUploadPath);
    },
    filename: (req, file, cb) => {
        // ✅ 生成唯一文件名
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
        cb(null, uniqueName);
    },
});

// ✅ 只允许上传图片
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('只允许上传图片文件！'), false);
    }
};

// ✅ 初始化 multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 限制
    fileFilter,
});

module.exports = upload;
