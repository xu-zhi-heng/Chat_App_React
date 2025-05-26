const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const generateUsername = () => {
    return 'user_' + Math.random().toString(36).substring(7);
};

exports.register = async (req, res) => {

    const { nickname, password, email, phone } = req.body

    try {
        // ✅ 生成随机用户名
        const username = generateUsername();

        // 检查用户名是否已经存在
        const existingUser = await User.findUserByEmailOrPhone(email, phone);
        if (existingUser) {
            return res.status(400).json({ msg: '邮箱或手机号已被注册' });
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // 头像上传
        let avatarPath = '';
        if (req.file) {
            avatarPath = `/files/avatars/${req.file.filename}`; // ✅ 文件路径
        } else {
            return res.status(400).json({ code: 400, msg: '请上传头像！' });
        }
        const result = await User.createUser(
            username,
            hashedPassword,
            nickname,
            avatarPath,
            email,
            phone
        );
        if (result.affectedRows === 1) {
            return res.status(200).json({msg : '用户注册成功', code: 200})
        } else {
            return res.status(500).json({msg : '用户注册失败，请稍后再试', code: 500})
        }
    } catch (err) {
        console.error('❌ 服务器错误:', err.message);
        res.status(500).json({ msg: '服务器错误', error: err.message });
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(400).json({msg : "用户名或密码错误"})
        }
        // 检查密码是否正确
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: '用户名或密码错误', code: 500});
        }
        // 生成JWT令牌
        const payload = {id: user.id, username: user.username}
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"})
        res.status(200).json({
            msg: "登录成功",
            code: 200,
            token,
            user: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar: user.avatar
            }
        })
    } catch (err) {
        console.error('❌ 服务器错误:', err.message);
        res.status(500).json({ msg: '服务器错误', error: err.message });
    }
}

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const filePath = `/server/files/avatars/${req.file.filename}`;
        return res.status(200).json({
            messages: "上传文件成功",
            path: filePath
        })
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'Server error during upload' });
    }
}
