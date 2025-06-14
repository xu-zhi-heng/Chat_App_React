import React from "react";
import { Input, List, Avatar } from "antd";
import { callData } from "../../../mockData/listData";
import styles from "./CallListSider.module.css";
import commonStyles from "../../../assets/css/common.module.css"

const CallListSider = () => {
    return (
        <div className={commonStyles.pageContainer}>
            <h2 className={commonStyles.pageTitle}>📞 电话列表</h2>
            {/* 搜索框 */}
            <Input
                placeholder="搜索通话记录..."
                className={commonStyles.searchBox}
                allowClear
            />
            {/* 电话记录列表 */}
            <List
                className={styles.callList}
                dataSource={callData}
                renderItem={(item) => (
                    <List.Item className={styles.listItem}>
                        <div className={styles.avatarContainer}>
                            <Avatar src={item.avatar} size={50} />
                        </div>
                        <div className={styles.contentContainer}>
                            <div className={styles.callName}>{item.name}</div>
                            <div className={styles.callTime}>{item.time}</div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default CallListSider;
