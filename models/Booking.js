const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gasProvider: { type: mongoose.Schema.Types.ObjectId, ref: "GasProvider" },
  slotTime: { type: String, required: true },
  status: { type: String, enum: ["Booked", "Cancelled"], default: "Booked" },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
