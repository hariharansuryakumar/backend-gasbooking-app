const mongoose = require("mongoose");
const GasProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., LPG, CNG, etc.
    location: { type: String, required: true },
    contact: { type: String, required: true },
  availableSlots: [
    {
      time: { type: String, required: true },
      slots: { type: Number, required: true, default: 10 },
    },
  ],
});

module.exports = mongoose.model("GasProvider", GasProviderSchema);
