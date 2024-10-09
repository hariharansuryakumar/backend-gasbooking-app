const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String, // Implement hashing for security
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
});

module.exports = mongoose.model("users", UserSchema);
