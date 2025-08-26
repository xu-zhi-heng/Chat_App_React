export function getCurrentTime() {
    const now = new Date();
    // 补零函数：将数字转为字符串，不足2位则前面补零
    const padZero = (num) => num.toString().padStart(2, '0');
    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1); // 月份补零
    const day = padZero(now.getDate()); // 日期补零
    const hour = padZero(now.getHours()); // 小时补零
    const minute = padZero(now.getMinutes()); // 分钟补零
    const second = padZero(now.getSeconds()); // 秒补零
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
