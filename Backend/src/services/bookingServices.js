import Booking from "../models/bookings.js";

// Lấy bản đồ trạng thái các sân (Mapping)
export const getPendingMapping = async (centerId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Tìm tất cả các booking không bị hủy trong ngày
  const bookings = await Booking.find({
    centerId,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: "cancelled" }
  });

  const mapping = {};
  bookings.forEach(b => {
    b.courts.forEach(c => {
      if (!mapping[c.courtId]) mapping[c.courtId] = Array(20).fill("trống");
      c.timeslots.forEach(slot => {
        // times[0] ứng với 5h sáng, nên index = slot - 5
        const index = slot - 5; 
        if (index >= 0) mapping[c.courtId][index] = { status: b.status, userId: b.userId };
      });
    });
  });
  return mapping;
};

// Xử lý giữ chỗ hoặc bỏ giữ chỗ (Toggle)
export const togglePendingTimeslot = async (data) => {
  const { userId, centerId, date, courtId, timeslot } = data;
  
  // Kiểm tra xem khung giờ này đã có ai đặt chưa
  const existing = await Booking.findOne({
    centerId,
    date,
    "courts.courtId": courtId,
    "courts.timeslots": timeslot,
    status: { $in: ["paid", "processing"] }
  });

  if (existing) throw new Error("Khung giờ này đã có người đặt!");

  // Logic đơn giản: Tạo một bản ghi 'pending' mới
  const newPending = new Booking({
    userId,
    centerId,
    date,
    courts: [{ courtId, timeslots: [timeslot] }],
    totalAmount: 0, // Sẽ tính toán ở bước thanh toán
    status: "pending"
  });
  return await newPending.save();
};