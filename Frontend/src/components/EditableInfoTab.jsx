import React, { useState } from 'react';
import { FaPen, FaCheck } from 'react-icons/fa';

const EditableInfoCard = ({ label, value, onConfirm }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleButtonClick = () => {
    if (isEditing) {
      // Khi nhấn xác nhận (dấu tích)
      if (onConfirm) onConfirm(tempValue);
      setIsEditing(false);
    } else {
      // Bắt đầu chỉnh sửa
      setIsEditing(true);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-200 h-full">
      <div className="flex flex-col flex-grow mr-3 overflow-hidden">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">
          {label}
        </span>
        
        {isEditing ? (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full border-b-2 border-green-500 focus:outline-none text-gray-800 py-0.5 bg-transparent"
            autoFocus
          />
        ) : (
          <span className="text-gray-800 font-medium truncate text-sm" title={value}>
            {value}
          </span>
        )}
      </div>
      
      <button
        onClick={handleButtonClick}
        className={`p-2 rounded-full flex-shrink-0 transition-colors duration-200 ${
          isEditing 
            ? "bg-green-100 text-green-700 hover:bg-green-200" 
            : "text-gray-400 hover:bg-gray-100 hover:text-green-600"
        }`}
        title={isEditing ? "Lưu lại" : "Chỉnh sửa"}
      >
        {isEditing ? <FaCheck size={14} /> : <FaPen size={14} />}
      </button>
    </div>
  );
};

export default EditableInfoCard;