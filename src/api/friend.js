import api from './api';

export const getFriendList = (value) => {
    return api.get(`/friend/getFriendList?status=${value}`)
}

export const getFriendDetailInfo = (value) => {
    return api.get(`/friend/getFriendInfo?friendId=${value}`)
}
