import * as billService from "../services/billManageServices.js";

export const getHistory = async (req, res) => {
  try {
    const { userId, page, limit } = req.query;
    const result = await billService.getBookingHistory(userId, parseInt(page), parseInt(limit));
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentImage, imageType, note } = req.body;
    const updated = await billService.updatePaymentProof(bookingId, paymentImage, imageType, note);
    res.status(200).json({ success: true, booking: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};