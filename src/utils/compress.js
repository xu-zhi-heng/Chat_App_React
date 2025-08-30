// 压缩图片函数
export function compressImage(file, quality = 0.7) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // 保持宽高比，可根据需求限制最大尺寸（如1080p）
            const maxWidth = 1920;
            const scale = Math.min(maxWidth / img.width, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            // 绘制图片并压缩
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                resolve(new File([blob], file.name, { type: file.type }));
            }, file.type, quality); // quality 0.7~0.9 平衡质量和体积
        };
    });
}
