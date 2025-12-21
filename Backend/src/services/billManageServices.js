import Booking from "../models/bookings.js";


export const getBookingHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const history = await Booking.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("centerId", "name address");
  
  const total = await Booking.countDocuments({ userId });
  return { history, total, page, totalPages: Math.ceil(total / limit) };
};

export const updatePaymentProof = async (bookingId, imageData, imageType, note) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Không tìm thấy đơn hàng");

  booking.paymentImage = Buffer.from(imageData, 'base64');
  booking.imageType = imageType;
  booking.note = note || booking.note;
  booking.status = "processing"; 
  booking.expiresAt = null; 
  
  return await booking.save();
};