const { query } = require('../config/db');

const User = {
    // ✅ 创建用户
    async createUser(username, hashedPassword, nickname, avatar, email, phone) {
        const sql = `
          INSERT INTO user (username, password, nickname, avatar, email, phone)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        return await query(sql, [username, hashedPassword, nickname, avatar, email, phone]);
    },

    // ✅ 查找用户通过用户名
    async findUserByUsername(username) {
        const sql = `SELECT * FROM user WHERE username = ? LIMIT 1`;
        const results = await query(sql, [username]);
        return results[0];
    },

    // ✅ 根据 ID 查找用户
    async findUserById(id) {
        const sql = `SELECT * FROM user WHERE id = ? LIMIT 1`;
        const results = await query(sql, [id]);
        return results[0];
    },

    async findUserByEmailOrPhone(email, phone) {
        const sql = `
          SELECT * FROM user
          WHERE email = ? OR phone = ?
          LIMIT 1
        `;
        const results = await query(sql, [email, phone]);
        return results[0];
    },
};

module.exports = User;
