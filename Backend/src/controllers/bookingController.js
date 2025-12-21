import * as bookingService from "../services/bookingServices.js";

export const getMapping = async (req, res) => {
  try {
    const { centerId, date } = req.query;
    const mapping = await bookingService.getPendingMapping(centerId, date);
    res.status(200).json({ success: true, mapping });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePending = async (req, res) => {
  try {
    const result = await bookingService.togglePendingTimeslot(req.body);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};