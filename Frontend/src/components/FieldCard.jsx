import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const FieldCard = ({ field }) => {
  const navigate = useNavigate();
  
  // Dữ liệu mặc định 
  const { 
    id = "unknown", 
    name = "Sân Tiêu Chuẩn", 
    location = "Hà Nội", 
    priceRange = "Liên hệ", 
    rating = 5, 
    reviews = 0, 
    image = "https://via.placeholder.com/300" 
  } = field || {};

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={index < rating ? "text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  const goToBooking = () => {
    // Logic điều hướng cơ bản cho giai đoạn UI layout
    navigate('/booking', {
      state: {
        fieldId: id,
        fieldName: name,
        date: new Date().toISOString().split("T")[0]
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 border border-gray-100 m-2">
      <div className="h-48 overflow-hidden relative group">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-2 flex items-center">
          <span className="mr-1">📍</span> {location}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex mr-2">{renderStars(Math.round(rating))}</div>
          <span className="text-xs text-gray-500">({reviews} đánh giá)</span>
        </div>
        
        <div className="mt-auto flex justify-between items-center border-t pt-3">
          <span className="font-bold text-green-700 text-lg">{priceRange}</span>
          <button 
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-md active:scale-95"
            onClick={goToBooking}
          >
            Đặt Sân Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldCard;