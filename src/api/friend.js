import api from './api';

export const getFriendList = (value) =>{
    return api.get(`/friend/getFriendList?status=${value}`)
}
