const express = require("express");
const { gasProviderSchema } = require("../middlewares/common.validation");
const validator = require("express-joi-validation").createValidator({});
const gasProvider = require("../components/gas-provider");
const gasProviderRouter = express.Router();
const { authenticateJWT } = require("../middlewares/passport.middleware");

gasProviderRouter.get("/get", authenticateJWT, gasProvider.getAllGasProviders);
gasProviderRouter.post(
  "/create",
  validator.body(gasProviderSchema),
  authenticateJWT,
  gasProvider.createGasProvider
);

module.exports = gasProviderRouter;
