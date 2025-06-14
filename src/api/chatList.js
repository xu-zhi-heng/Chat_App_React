import api from './api';

export const getAllChatList = (value) => {
    return api.get(`/chatList/getChatList?userId=${value}`)
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
