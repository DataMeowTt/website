import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingHeader from "./BookingHeader";

const SessionExpired = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-green-800 text-white flex flex-col">
      <BookingHeader title="Hết hạn phiên" onBack={() => navigate("/")} />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">HẾT HẠN THANH TOÁN!</h2>
        <p className="mb-8">Thời gian giữ chỗ của bạn đã hết hạn. Vui lòng thực hiện đặt sân lại.</p>
        <button onClick={() => navigate("/")} className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold">Quay về Trang Chủ</button>
      </div>
    </div>
  );
};

export default SessionExpired;