import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearAllPendingBookings, confirmBooking } from "../apis/booking";
import { Copy, Clock, AlertTriangle, Upload, User, Phone, Hash, Calendar, DollarSign } from "lucide-react";
import SessionExpired from "../components/SessionExpired";
import BookingHeader from "../components/BookingHeader";
import { AuthContext } from "../contexts/AuthContext";
import { fetchUserInfo } from "../apis/users";
import '../styles/payments.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, setUser } = useContext(AuthContext);

  const userId = user?._id || "000000000000000000000001";
  const centerId = state?.centerId || localStorage.getItem("centerId");
  const initialDate = state?.date || localStorage.getItem("selectedDate");
  const totalPrice = state?.total || Number(localStorage.getItem("totalAmount")) || 0;
  const bookingCode = state?.bookingCode || localStorage.getItem("bookingId") || "BK123456";
  const centerName = localStorage.getItem("centerName") || "Trung Tâm";

  const [timeLeft, setTimeLeft] = useState(300);
  const [showCopied, setShowCopied] = useState(false);
  const [paymentImageBase64, setPaymentImageBase64] = useState("");
  const [note, setNote] = useState("");
  const [slotGroups, setSlotGroups] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const paymentFileInputRef = useRef(null);

  useEffect(() => {
    const storedGroups = localStorage.getItem("slotGroups");
    if (storedGroups) setSlotGroups(JSON.parse(storedGroups));
    
    // Đếm ngược 5 phút
    const expiresAt = localStorage.getItem("bookingExpiresAt");
    const interval = setInterval(() => {
      const remaining = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmOrder = async () => {
    if (!paymentImageBase64) return alert("Vui lòng tải ảnh xác nhận chuyển khoản");
    setIsConfirmModalOpen(true);
  };

  const handleModalAction = async (action) => {
    if (action === "confirm") {
      const { success } = await confirmBooking({
        userId, centerId, date: initialDate, totalPrice, paymentImage: paymentImageBase64, note
      });
      if (success) {
        setIsSuccessModalOpen(true);
        const updated = await fetchUserInfo();
        setUser(updated.user);
      }
    }
    setIsConfirmModalOpen(false);
  };

  if (timeLeft === 0) return <SessionExpired />;

  return (
    <div className="min-h-screen bg-green-800 text-white">
      <BookingHeader title="Thanh toán" onBack={() => navigate("/")} />
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-green-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-yellow-300 font-bold mb-4 flex items-center gap-2"><DollarSign /> Thông tin ngân hàng</h2>
            <p>Tên TK: TRAN VIET HUNG</p>
            <p>STK: 09030205186 (MBBank)</p>
          </div>
          <div className="bg-green-900 p-6 rounded-lg text-center">
            <p className="text-gray-400 mb-1 flex justify-center items-center gap-2"><Clock size={16}/> Thời gian còn lại:</p>
            <h3 className="text-4xl font-bold text-yellow-300">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-lg text-black">
            <label className="font-bold mb-2 block text-green-800">Tải bill thanh toán *</label>
            <input type="file" onChange={(e) => {
              const reader = new FileReader();
              reader.onload = () => setPaymentImageBase64(reader.result);
              reader.readAsDataURL(e.target.files[0]);
            }} className="w-full border p-2" />
          </div>
          <button onClick={handleConfirmOrder} className="w-full bg-yellow-500 py-4 text-green-900 font-bold text-xl rounded-lg hover:bg-yellow-600">
            XÁC NHẬN ĐẶT SÂN
          </button>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-green-900 p-6 rounded-lg sticky top-6">
            <h2 className="font-bold border-b border-green-700 pb-2 mb-4 text-yellow-300 underline">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 text-sm">
                <p>Mã: {bookingCode}</p>
                <p>Khách: {user?.name}</p>
                <p>Ngày: {initialDate}</p>
                <p className="text-lg font-bold">Tổng tiền: {totalPrice.toLocaleString()} đ</p>
            </div>
          </div>
        </div>
      </div>
      {/* Modal logic ở đây */}
    </div>
  );
};

export default PaymentPage;