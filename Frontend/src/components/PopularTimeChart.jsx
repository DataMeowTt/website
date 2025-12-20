import React, { useState, useEffect } from 'react';
import { getPopularTimeSlot } from '../apis/booking';

const PopularTimeChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Mock dữ liệu cho phiên bản phát triển để hiển thị giao diện ngay
        const data = {
          categoryDistribution: { percentages: { Sáng: 25, Trưa: 15, Chiều: 35, Tối: 45 } },
          popularTimeRange: "17:00 - 20:00",
          popularCount: 128
        };
        setChartData(data);
      } catch (err) {
        console.error("Lỗi tải biểu đồ");
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-500">Đang tải thống kê...</div>;

  const { percentages } = chartData.categoryDistribution;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h4 className="font-bold text-gray-800 mb-6 flex items-center">
        <i className="fas fa-chart-bar mr-2 text-green-600"></i>
        Giờ cao điểm tại trung tâm
      </h4>
      <div className="flex justify-between items-end h-32 px-2">
        {Object.entries(percentages).map(([label, value]) => (
          <div key={label} className="flex flex-col items-center w-1/5 group">
            <div 
              className="bg-green-500 w-full rounded-t-md group-hover:bg-green-600 transition-all duration-300 relative" 
              style={{ height: `${value}%` }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-700 opacity-0 group-hover:opacity-100 transition-opacity">
                {value}%
              </span>
            </div>
            <span className="text-xs mt-2 font-medium text-gray-500">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center text-sm text-gray-600">
        <i className="fas fa-star text-yellow-400 mr-2"></i>
        <span>Giờ phổ biến nhất: <strong className="text-gray-800">{chartData.popularTimeRange}</strong></span>
      </div>
    </div>
  );
};

export default PopularTimeChart;