const fs = require("fs");
const {
    decryptSeed,
    seedExists,
    loadSeed,
    get2FACode,
    verify2FA,
} = require("../services/2fa.service");

const PRIVATE_KEY_PATH = "./keys/student_private.pem";

// POST /2fa/decrypt-seed
const decryptSeedController = (req, res) => {
    const { encrypted_seed } = req.body;

    if (!encrypted_seed) {
        return res.status(400).json({ error: "Missing encrypted_seed" });
    }

    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");

    const ok = decryptSeed(encrypted_seed, privateKey);

    if (ok) return res.json({ status: "ok" });
    else return res.status(500).json({ error: "Decryption failed" });
};

// GET /2fa/generate-2fa
const generate2FAController = (req, res) => {
    if (!seedExists()) {
        return res.status(500).json({ error: "Seed not decrypted yet" });
    }

    const seed = loadSeed();
    const { code, validFor } = get2FACode(seed);

    return res.json({
        code,
        valid_for: validFor,
    });
};

// POST /2fa/verify-2fa
const verify2FAController = (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Missing code" });
    }

    if (!seedExists()) {
        return res.status(500).json({ error: "Seed not decrypted yet" });
    }

    const seed = loadSeed();
    const valid = verify2FA(seed, code);

    return res.json({ valid });
};

module.exports = {
    decryptSeedController,
    generate2FAController,
    verify2FAController,
};