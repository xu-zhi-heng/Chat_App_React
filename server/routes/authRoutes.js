const express = require("express")
const { register, login, uploadFile } = require("../controller/authController")
const router = express.Router();

const upload = require('../config/multerConfig');

// 用户注册（带文件上传）
router.post('/auth/register', upload.single('avatar'), register);

router.post('/auth/login', login);

router.post('/auth/uploadFile', upload.single('avatar'), uploadFile)

module.exports = router
