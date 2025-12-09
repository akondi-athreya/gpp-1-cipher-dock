const express = require("express");
const router = express.Router();

const twofaRoutes = require("./2fa.routes");

router.use("/2fa", twofaRoutes);

module.exports = router;