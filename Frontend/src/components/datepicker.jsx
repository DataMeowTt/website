import React from "react";

const DatePicker = ({ value, onDateChange }) => {
  // Lấy ngày hôm nay định dạng "YYYY-MM-DD"
  const today = new Date().toLocaleDateString("en-CA");

  // Tính ngày giới hạn (1 tháng sau)
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const maxDate = oneMonthLater.toISOString().split("T")[0];

  const currentValue = value || today;

  return (
    <div className="flex flex-col w-full sm:w-auto">
      <label 
        htmlFor="bookingDatePickerInput" 
        className="text-xs text-gray-500 font-bold uppercase mb-1"
      >
        Ngày đặt sân
      </label>
      <input
        id="bookingDatePickerInput"
        type="date"
        value={currentValue}
        min={today}
        max={maxDate}
        onChange={(e) => {
          if (onDateChange) {
            onDateChange(e.target.value);
          }
        }}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all cursor-pointer"
        data-testid="booking-date-picker-input"
      />
    </div>
  );
};

export default DatePicker;