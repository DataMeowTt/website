import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DashboardAdmin from "@/pages/Dashboard";
import Login from "@/pages/Login";
import AdminNews from '@/pages/news';
import RatingManagement from '@/pages/ratingManagement';
import Account from '@/pages/Account';
import Shop from '@/pages/shop';
import StockManagement from '@/pages/stockManagement';
import Report from '@/pages/Report'
import UserManage from './pages/UserManage';
import AdminBillList from './pages/BillManage';
import CreateFixedBooking from './pages/CreateFixedBooking';
import CourtStatusPage from './pages/centerStatus';



function App() {
  const isAuthenticated = false;  // Thay đổi theo logic xác thực thực tế

  return (
    <Router>
      <Routes>
        {/* Chuyển hướng trang chủ tùy thuộc vào trạng thái đăng nhập */} 
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />            
        <Route path="/news" element={<AdminNews />} /> 
        <Route path="/account" element={<Account />} />
        <Route path="/shop" element={<Shop />}/> 
        <Route path="/stock" element={<StockManagement />}/> 
        <Route path="/report" element={<Report />}/> 
        <Route path="/ratings" element={<RatingManagement />} /> 
        <Route path="/users-manage" element={<UserManage />} />
        <Route path="/admin-bill-list" element={<AdminBillList />} />
        <Route path="/create-fixed-booking" element={<CreateFixedBooking />} />
        <Route path="/center-status" element={<CourtStatusPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;