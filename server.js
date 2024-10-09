const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow these HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow these headers
};
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(cors(corsOptions));
// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("MongoDB Not Connected", err.message));

// Routes
app.use("/api/user", require("./routes/user.router"));
app.use("/api/gas-provider", require("./routes/gas-provider.router"));
app.use("/api/booking", require("./routes/booking.router"));
