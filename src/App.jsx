import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";

const App = () => {
    return (
        <Routes>
            {/* 默认路由重定向 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

const NotFound = () =>
    <h2 style={{ color: '#FF4D4F', textAlign: 'center' }}>404 - 页面未找到</h2>;

export default App
