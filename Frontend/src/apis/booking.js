import axiosInstance from "../config/axiosConfig";

// Lấy danh sách trạng thái các sân tại một trung tâm và ngày cụ thể
export const getPendingMapping = async (centerId, date) => {
  try {
    const response = await axiosInstance.get("/api/booking/pending/mapping", {
      params: { centerId, date }
    });
    return response.data.mapping;
  } catch (error) {
    console.error("Lỗi lấy mapping đặt sân:", error);
    throw error;
  }
};

// Toggle (Chọn/Bỏ chọn) một khung giờ (giữ chỗ tạm thời)
export const togglePendingTimeslot = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/booking/pending/toggle", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi giữ chỗ khung giờ:", error);
    throw error;
  }
};

// Xác nhận lưu thông tin đặt sân vào Database trước khi thanh toán
export const confirmBookingToDB = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/booking/pending/pendingBookingToDB", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi xác nhận booking:", error);
    throw error;
  }
};

// Lấy thống kê khung giờ phổ biến
export const getPopularTimeSlot = async () => {
  try {
    const response = await axiosInstance.get('/api/booking/popular-times');
    return response.data.data;
  } catch (error) {
    console.error('Lỗi lấy thống kê thời gian:', error);
    throw error;
  }
};

// Xóa tất cả các booking đang chờ xử lý của user
export const clearAllPendingBookings = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/booking/pending/clear-all", payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi dọn dẹp booking tạm thời:", error);
    throw error;
  }
};