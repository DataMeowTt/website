import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import BookingHeader from "../components/BookingHeader";
import DatePicker from "../components/datepicker";
import Legend from "../components/legend";
import BookingTable from "../components/bookingTable";
import PopularTimeChart from "../components/PopularTimeChart";
import PricingTable from "../components/pricingTable";
import "../styles/booking.css";

const times = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const slotCount = times.length - 1;

const BookingSchedule = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [courts, setCourts] = useState([
    { _id: "c1", name: "Sân 01" }, { _id: "c2", name: "Sân 02" }, { _id: "c3", name: "Sân 03" }
  ]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Logic tính tiền và giảm giá chuẩn
  const calculateTotal = () => {
    const basePrice = 80000; // Giả lập đơn giá 80k/h
    let total = selectedSlots.length * basePrice;
    let discount = 0;
    
    if (selectedSlots.length >= 2) discount += 0.05; // Giảm 5% khi đặt từ 2h
    if (user?.points > 4000) discount += 0.10; // Giảm 10% cho khách VIP

    return {
      totalHours: selectedSlots.length,
      originalAmount: total,
      totalAmount: Math.round(total * (1 - discount)),
      discountRate: discount * 100
    };
  };

  const { totalHours, totalAmount, originalAmount, discountRate } = calculateTotal();

  const toggleBookingStatus = (rowIndex, colIndex) => {
    const slotId = `${courts[rowIndex]._id}-${times[colIndex]}`;
    const slotData = { courtId: courts[rowIndex]._id, time: times[colIndex], courtName: courts[rowIndex].name };

    setSelectedSlots(prev => 
      prev.some(s => `${s.courtId}-${s.time}` === slotId)
        ? prev.filter(s => `${s.courtId}-${s.time}` !== slotId)
        : [...prev, slotData]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <BookingHeader title="Đặt sân cầu lông" onBack={() => navigate('/centers')} />
      
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Cột trái: Lịch và Bảng giờ */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <DatePicker value={selectedDate} onDateChange={setSelectedDate} />
              <div className="flex flex-col items-end gap-2">
                <Legend />
                <button 
                  onClick={() => setShowPricingModal(true)}
                  className="text-green-700 text-sm font-bold flex items-center hover:underline"
                >
                  <i className="fas fa-tags mr-1"></i> Xem bảng giá chi tiết
                </button>
              </div>
            </div>

            <BookingTable 
              courts={courts} 
              times={times} 
              slotCount={slotCount} 
              toggleBookingStatus={toggleBookingStatus}
              bookingData={{}} // Sẽ đồng bộ Mapping ở commit cuối
            />
          </div>
        </div>

        {/* Cột phải: Thống kê và Thông tin thêm */}
        <div className="lg:col-span-1 space-y-6">
          <PopularTimeChart />
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 italic">
            <i className="fas fa-info-circle mr-2"></i>
            Hệ thống tự động giảm 5% cho các đơn đặt sân trên 2 giờ đồng hồ.
          </div>
        </div>
      </div>

      {/* Footer Thanh toán linh hoạt */}
      {selectedSlots.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Tổng thời gian</p>
                <p className="text-xl font-black text-gray-800">{totalHours} giờ</p>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Thành tiền</p>
                <p className="text-2xl font-black text-green-700">
                  {totalAmount.toLocaleString()} đ
                  {discountRate > 0 && <span className="text-[10px] ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded">-{discountRate}%</span>}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/payment')}
              className="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white px-12 py-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-green-200"
            >
              Tiếp tục thanh toán <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      )}

      {showPricingModal && (
        <PricingTable onClose={() => setShowPricingModal(false)} centerId="mock-id" />
      )}
    </div>
  );
};

export default BookingSchedule;