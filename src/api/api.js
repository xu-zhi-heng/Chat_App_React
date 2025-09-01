import axios from 'axios';

// ✅ 基础配置
const api = axios.create({
    baseURL: 'http://101.132.121.100:8081/api', // 后端接口地址
    // baseURL: 'http://127.0.0.1:8081/api', // 后端接口地址
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json',
    },
});


// ✅ 请求拦截器
api.interceptors.request.use(
    (config) => {
        // 如果 sessionStorage 里有 token，自动携带, sessionStorage是每个网页标签页进行隔离的
        const token = sessionStorage.getItem('sweet_fun_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✅ 响应拦截器
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.log(error)
        if (error.response && error.response.status === 401) {
            console.warn('未授权，跳转到登录');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
