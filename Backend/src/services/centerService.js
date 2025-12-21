import Center from "../models/centers.js";
import Court from "../models/courts.js";

export const getAllCenters = async (query) => {
  const { search, location, sort } = query;
  let filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (location) filter.location = location;
  return await Center.find(filter);
};

export const getCenterById = async (id) => {
  return await Center.findById(id);
};

// --- MỚI: Lấy danh sách sân của trung tâm ---
export const getCourtsByCenterId = async (centerId) => {
  return await Court.find({ centerId });
};

export const getCenterPricing = async (id) => {
  const center = await Center.findById(id).select("pricing name");
  return { title: center.name, weekday: center.pricing.weekday, weekend: center.pricing.weekend };
};