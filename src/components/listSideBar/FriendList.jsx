import React, {useEffect, useState} from "react";
import { Input, List, Avatar, Badge } from "antd";
import { friendData } from "../../mockData/listData";
import "../../assets/css/friendList.css";
import {getFriendList} from "../../api/friend";

const FriendList = () => {
    let [friendList, setFriendList] = useState([])
    useEffect(() => {
        let token = localStorage.getItem("sweet_fun_token");
        getFriendList(1).then(res => {
            if (res.code === 200) {
                setFriendList(res.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div className="page-container">
            <h2 className="page-title">👥 好友列表</h2>

            {/* 搜索框 */}
            <Input placeholder="搜索好友..." className="search-box" allowClear />

            {/* 好友列表 */}
            <List
                className="friend-list"
                dataSource={friendList}
                renderItem={(item) => (
                    <List.Item className="list-item">
                        <div className="avatar-container">
                            <Badge
                                dot
                                offset={[-4, 36]} // 设置圆点位置
                                status={item.isOnline ? "success" : "default"}
                            >
                                <Avatar src={item.avatar} size={50} />
                            </Badge>
                        </div>

                        {/* 右侧内容 */}
                        <div className="content-container">
                            <div className="friend-name">{item.nickname}</div>
                            <div className="friend-status">{item.signature}</div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default FriendList;
