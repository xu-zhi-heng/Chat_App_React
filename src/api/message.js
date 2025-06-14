import api from "./api";

export const getMessageListBetweenUsers = (userId, friendId, time) => {
    return api.get(`/message/getMessagesBetweenUsers?userId1=${userId}&userId2=${friendId}&time=${time}`)
}

export const getMessageListApi = () => {
    return api.get("/message/getMessageList")
}
