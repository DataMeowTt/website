import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Account from '@/pages/Account';

function App() {
  const isAuthenticated = false;  // Thay đổi theo logic xác thực thực tế

  return (
    <Router>
      <Routes>
        {/* Chuyển hướng trang chủ tùy thuộc vào trạng thái đăng nhập */} 
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />            

        <Route path="/account" element={<Account />} />
        
      </Routes>
    </Router>
  );
}

export default App;