const express = require("express");
const booking = require("../components/booking");
const bookingRouter = express.Router();
const { authenticateJWT } = require("../middlewares/passport.middleware");
const {
  bookingSchema,
  cancelBookingSchema,
} = require("../middlewares/common.validation");
const validator = require("express-joi-validation").createValidator({});

bookingRouter.get("/get", authenticateJWT, booking.getAllGasBookings);
bookingRouter.post(
  "/create",
  authenticateJWT,
  validator.body(bookingSchema),
  booking.createGasBooking
);
bookingRouter.post(
  "/cancel",
  authenticateJWT,
  validator.body(cancelBookingSchema),
  booking.cancelBooking
);

module.exports = bookingRouter;
