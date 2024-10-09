const Booking = require("../models/Booking");
const GasProvider = require("../models/GasProvider");

const createGasBooking = async (req, res) => {
  const { _id } = req.user;
  const { slotTime, providerId } = req.body;
  const gasProviderFilter = {
    _id: providerId,
    availableSlots: {
      $elemMatch: {
        time: slotTime,
        slots: { $gte: 1 },
      },
    },
  };

  try {
    const gasProviderDetails = await GasProvider.find(gasProviderFilter);

    if (!gasProviderDetails.length)
      return res.status(500).json("Slots Not available");

    const booking = new Booking({
      user: _id.toJSON(),
      gasProvider: providerId,
      slotTime: slotTime,
      status: "Booked",
      paymentStatus: "Pending",
    });

    const slotAvailable = gasProviderDetails[0]?.availableSlots
      ?.find((f) => f.time === slotTime)
      .toJSON();

    const savedBook = await Booking.create(booking);
    const saveGasProvider = await GasProvider.findOneAndUpdate(
      gasProviderFilter,
      {
        $set: {
          "availableSlots.$.slots": slotAvailable.slots - 1,
        },
      }
    );

    // Send a success response
    res.status(201).json(savedBook);
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ error: `Error creating gas provider: ${error.message}` });
  }
};

const cancelBooking = async (req, res) => {
  const { slotTime, providerId, bookingId } = req.body;
  const gasProviderFilter = {
    _id: providerId,
    availableSlots: {
      $elemMatch: {
        time: slotTime,
      },
    },
  };

  try {
    const gasProviderDetails = await GasProvider.find(gasProviderFilter);

    if (!gasProviderDetails.length)
      return res.status(500).json("Slots Not available");

    const slotAvailable = gasProviderDetails[0]?.availableSlots
      ?.find((f) => f.time === slotTime)
      .toJSON();

    await Booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: { status: "Cancelled" } }
    );

    await GasProvider.findOneAndUpdate(gasProviderFilter, {
      $set: {
        "availableSlots.$.slots": slotAvailable.slots + 1,
      },
    });

    // Send a success response
    res.status(201).json({ data: "Successfully Updated" });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ error: `Error creating gas provider: ${error.message}` });
  }
};

const getAllGasBookings = async (req, res, next) => {
  const { _id } = req.user;
  const pageNumber = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.limit, 10) || 10;
  const query = { user: _id };

  // Ensure page and limit are positive integers
  if (pageNumber <= 0 || pageSize <= 0) {
    return res
      .status(400)
      .json({ error: "Page and limit must be positive integers." });
  }

  // Calculate the skip value
  const skip = (pageNumber - 1) * pageSize;

  try {
    const totalItems = await Booking.countDocuments(query);

    const bookingList = await Booking.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate("gasProvider")
      .exec();

    const totalPages = Math.ceil(totalItems / pageSize);

    res.status(200).json({
      totalItems,
      totalPages,
      currentPage: pageNumber,
      pageSize,
      bookingList,
    });
  } catch (error) {
    res.status(500).json({
      error: `Error fetching paginated gas providers: ${error.message}`,
    });
  }
};

module.exports = {
  createGasBooking,
  cancelBooking,
  getAllGasBookings,
};
