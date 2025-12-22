import '../models/users.js';
import Rating from '../models/ratings.js';

/**
 * Fetch ratings by center ID
 * @param {String} centerId
 */
export async function getRatingsByCenter(centerId) {
  return await Rating.find({ center: centerId })
    .populate('user', 'username email name')
    .sort({ createdAt: -1 });
}

/**
 * Delete a rating by its ID
 * @param {String} ratingId
 */
export async function deleteRatingById(ratingId) {
  return await Rating.findByIdAndDelete(ratingId);
}

export const getCommentsForCenterService = async (centerId) => {
  if (!centerId) {
    throw { status: 400, message: "Center ID is required" };
  }
  
  const reviews = await Rating.find({ center: centerId }).sort({ createdAt: -1 });
  return reviews;
};
