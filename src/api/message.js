import api from "./api";

export const getMessageListBetweenUsers = (userId, friendId, time) => {
    return api.get(`/message/getMessagesBetweenUsers?userId1=${userId}&userId2=${friendId}&time=${time}`)
}

export const updateMessage = (message) => {
    return api.post(`/message/updateMessage`, message)
}

export const getMessageListApi = () => {
    return api.get("/message/getMessageList")
}
