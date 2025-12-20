import Center from "../models/centers.js";

// Lấy danh sách tất cả trung tâm với các bộ lọc cơ bản
export const getAllCenters = async (query) => {
  const { search, location, sort } = query;
  let filter = {};
  
  if (search) filter.name = { $regex: search, $options: "i" };
  if (location) filter.location = location;

  let sortOption = {};
  if (sort === "rating") sortOption.avgRating = -1;
  else if (sort === "popular") sortOption.bookingCount = -1;

  return await Center.find(filter).sort(sortOption);
};

// Lấy thông tin chi tiết của một trung tâm
export const getCenterById = async (id) => {
  return await Center.findById(id);
};

// Lấy bảng giá của trung tâm
export const getCenterPricing = async (id) => {
  const center = await Center.findById(id).select("pricing name");
  if (!center) throw new Error("Không tìm thấy trung tâm");
  return {
    title: center.name,
    weekday: center.pricing.weekday,
    weekend: center.pricing.weekend
  };
};