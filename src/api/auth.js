import api from './api';

// 用户登录
export const login = (values) => {
    return api.post('/user/login', values);
};

// 用户注册
export const register = (values) => {
    return api.post('/user/register', values);
};

// 获取当前用户信息
export const getUserInfo = (value) => {
    return api.get('/user/profile');
};
