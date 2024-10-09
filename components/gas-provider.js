const GasProvider = require("../models/GasProvider");
const passport = require("passport");

const getAllGasProviders = async (req, res, next) => {
  // Extract pagination parameters
  const pageNumber = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.limit, 10) || 10;

  // Extract the search term
  const searchTerm = req.query.name ? req.query.name.trim() : "";

  // Ensure page and limit are positive integers
  if (pageNumber <= 0 || pageSize <= 0) {
    return res
      .status(400)
      .json({ error: "Page and limit must be positive integers." });
  }

  // Calculate the skip value
  const skip = (pageNumber - 1) * pageSize;

  try {
    const query = searchTerm
      ? { name: { $regex: new RegExp(searchTerm, "i") } }
      : {};

    const totalItems = await GasProvider.countDocuments(query);

    const providers = await GasProvider.find(query)
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalPages = Math.ceil(totalItems / pageSize);

    res.status(200).json({
      totalItems,
      totalPages,
      currentPage: pageNumber,
      pageSize,
      providers,
    });
  } catch (error) {
    res.status(500).json({
      error: `Error fetching paginated gas providers: ${error.message}`,
    });
  }
};

const createGasProvider = async (req, res) => {
  const { name, category, availableSlots, location, contact } = req.body;

  try {
    const newGasProvider = new GasProvider({
      name,
      category,
      availableSlots,
      location, 
      contact,
    });

    const savedProvider = await newGasProvider.save();

    // Send a success response
    res.status(201).json(savedProvider);
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ error: `Error creating gas provider: ${error.message}` });
  }
};

module.exports = {
  getAllGasProviders,
  createGasProvider,
};
