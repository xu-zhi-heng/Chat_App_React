import {getFilePresignedUrl} from "../api/file";

const defaultImageUrl = "https://thf.bing.com/th/id/OIP.2bip_3OHH5fdJbztzBefPwHaEt?w=237&h=180&c=7&r=0&o=7&cb=thfc1&dpr=1.3&pid=1.7&rm=3"
const imageUrlCache = new Map();
// 可以在获取图片URL的函数中添加简单的节流逻辑
const requestQueue = new Set();
export async function getRelImageUlr(imageUrl) {
    // 如果正在请求中，等待结果
    if (requestQueue.has(imageUrl)) {
        await new Promise(resolve => {
            const check = () => {
                if (!requestQueue.has(imageUrl)) resolve();
                else setTimeout(check, 50);
            };
            check();
        });
        return imageUrlCache.get(imageUrl) || defaultImageUrl;
    }
    if (imageUrlCache.has(imageUrl)) {
        return imageUrlCache.get(imageUrl);
    }
    if (!imageUrl) {
        return defaultImageUrl;
    }
    try {
        requestQueue.add(imageUrl);
        const res = await getFilePresignedUrl(imageUrl);
        const validUrl = res?.code === 200 && res?.data ? res.data : defaultImageUrl;
        imageUrlCache.set(imageUrl, validUrl);
        return validUrl;
    } catch (err) {
        console.error('获取图片URL失败:', err);
        return defaultImageUrl;
    } finally {
        requestQueue.delete(imageUrl);
    }
}
