const Joi = require("joi");

exports.userSchema = Joi.object({
  first_name: Joi.string().min(1).max(50).required(),
  last_name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(), // Minimum length for passwords, adjust as needed
});

// Define the validation schema
exports.loginSchema = Joi.object({
  user: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long",
      "string.empty": "Password is required",
    }),
  }).required(),
});

const availableSlotSchema = Joi.object({
  time: Joi.string().required(),
  slots: Joi.boolean().optional(),
});

exports.gasProviderSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid("LPG", "CNG", "Others").required(), // Adjust categories as needed
  location: Joi.string().required(),
  contact: Joi.string().required(),
  availableSlots: Joi.array().items(availableSlotSchema).required(),
});

exports.bookingSchema = Joi.object({
  providerId: Joi.string().required(),
  slotTime: Joi.string().required(),
});

exports.cancelBookingSchema = Joi.object({
  providerId: Joi.string().required(),
  slotTime: Joi.string().required(),
  bookingId: Joi.string().required(),
});
