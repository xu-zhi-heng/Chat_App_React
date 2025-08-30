import api from './api';

export const uploadFile = (file, url = "/file/uploadFile", onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percent);
            }
        }
    }).then(res => res);
};

export const getFilePresignedUrl = (filePath) => {
    return api.get(`/file/getUrl?filePath=${filePath}`)
}
