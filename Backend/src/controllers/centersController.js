import * as centerService from "../services/centerService.js";

export const getCenters = async (req, res) => {
  try {
    const centers = await centerService.getAllCenters(req.query);
    res.status(200).json({ success: true, data: centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCenterDetail = async (req, res) => {
  try {
    const center = await centerService.getCenterById(req.params.id);
    if (!center) return res.status(404).json({ success: false, message: "Không thấy trung tâm" });
    res.status(200).json({ success: true, center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPricing = async (req, res) => {
  try {
    const pricing = await centerService.getCenterPricing(req.params.id);
    res.status(200).json(pricing);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};