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

export function formatDateByToday(dateStr) {
    try {
        // 1. 解析目标日期字符串（需确保格式为 "YYYY-MM-DD HH:mm:ss"）
        const targetDate = new Date(dateStr);
        // 检查日期是否有效（避免非法字符串导致的 Invalid Date）
        if (isNaN(targetDate.getTime())) {
            throw new Error("日期字符串格式无效，请使用 'YYYY-MM-DD HH:mm:ss' 格式");
        }

        // 2. 获取当前日期（今天）
        const today = new Date();

        // 3. 对比目标日期与今天的「年月日」是否一致
        // （通过设置时分秒为 0，只比较日期部分）
        const isSameDay =
            targetDate.getFullYear() === today.getFullYear() &&
            targetDate.getMonth() === today.getMonth() && // 月份从 0 开始（0=1月，11=12月）
            targetDate.getDate() === today.getDate();     // 日期（1-31）

        // 4. 补零工具函数（确保时分/月日为两位数，如 9 时 → 09 时）
        const padZero = (num) => num.toString().padStart(2, '0');

        // 5. 根据是否为今天返回对应格式
        if (isSameDay) {
            // 今天：返回「时分」（HH:mm）
            const hours = padZero(targetDate.getHours());
            const minutes = padZero(targetDate.getMinutes());
            return `${hours}:${minutes}`;
        } else {
            // 非今天：返回「年月日 时分」（YYYY-MM-DD HH:mm）
            const year = targetDate.getFullYear();
            const month = padZero(targetDate.getMonth() + 1); // 月份+1（转为 1-12）
            const day = padZero(targetDate.getDate());
            const hours = padZero(targetDate.getHours());
            const minutes = padZero(targetDate.getMinutes());
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
    } catch (error) {
        // 捕获异常（如无效日期字符串），返回错误提示（可根据需求调整）
        console.error("日期格式化失败：", error.message);
        return "无效日期";
    }
}
