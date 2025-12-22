import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Center',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true 
});
RatingSchema.index({ center: 1, createdAt: -1 }); 
RatingSchema.index({ user: 1, createdAt: -1 }); 
RatingSchema.index({ center: 1, user: 1 }, { unique: true }); 

const Rating = mongoose.model("Rating", RatingSchema) || model("Rating", RatingSchema);
export default Rating;
