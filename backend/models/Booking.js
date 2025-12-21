import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  system: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "System",
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Booking", bookingSchema);
