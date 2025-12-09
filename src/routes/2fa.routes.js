const express = require("express");
const router = express.Router();

const {
    decryptSeedController,
    generate2FAController,
    verify2FAController,
} = require("../controllers/2fa.controller");

router.post("/decrypt-seed", decryptSeedController);
router.get("/generate-2fa", generate2FAController);
router.post("/verify-2fa", verify2FAController);

module.exports = router;