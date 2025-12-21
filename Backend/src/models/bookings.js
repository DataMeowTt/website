import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  centerId: { type: Schema.Types.ObjectId, ref: "Center", required: true, index: true },
  courts: [
    {
      courtId: { type: Schema.Types.ObjectId, ref: "Court", required: true },
      timeslots: [{ type: Number, required: true }],
    },
  ],
  date: { type: Date, required: true, index: true },
  status: {
    type: String,
    enum: ["pending", "processing", "paid", "cancelled"],
    default: "pending",
    index: true,
  },
  expiresAt: { type: Date, default: null }, // Thời gian hết hạn giữ chỗ
  totalAmount: { type: Number, required: true },
  bookingCode: { type: String, unique: true, sparse: true, index: true }, // Mã #Bill...
  createdAt: { type: Date, default: Date.now, index: true },
  note: { type: String, default: "" },
});

// Middleware tự động tạo mã BookingCode và tính thời gian hết hạn
bookingSchema.pre("save", async function (next) {
  if (this.isNew && !this.bookingCode) {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 12);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.bookingCode = `#Bill${formattedDate}${randomSuffix}`;
  }

  if (this.status === "pending" && this.isNew) {
    this.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
  }
  next();
});

// TTL Index: Tự động xóa document khi đến thời điểm expiresAt
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.models.Booking || model("Booking", bookingSchema);
export default Booking;