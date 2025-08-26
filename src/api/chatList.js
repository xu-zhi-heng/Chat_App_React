import api from './api';

export const getAllChatList = (value) => {
    return api.get(`/chatList/getChatList?userId=${value}`)
}

// 还没有实现
export const findChatList = (data) => {
    return api.post(`/chatList/findChatList`, data)
}

export const deleteChatList = (value) => {
    return api.post(`/chatList/deleteChatList?id=${value}`)
}

export const updateChatList = (value) => {
    return api.post(`/chatList/updateChatList`, value)
}

export const createChatList = (value) => {
    return api.post(`/chatList/createChatList`, value)
}
