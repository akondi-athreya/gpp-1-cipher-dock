const fs = require("fs");
const crypto = require("crypto");

const { generateTotpCode, verifyTotpCode } = require("../crypto/totp");

const SEED_PATH = "/data/seed.txt";

function decryptSeed(encryptedSeedB64, privateKeyPem) {
    try {
        const encryptedBuffer = Buffer.from(encryptedSeedB64, "base64");

        const decrypted = crypto.privateDecrypt(
            {
                key: privateKeyPem,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256"   // SPECIFICALLY SHA-256 for RSA OAEP
            },
            encryptedBuffer
        );

        const seed = decrypted.toString("utf8").trim();

        if (!/^[0-9a-f]{64}$/.test(seed)) {
            throw new Error("Invalid hex seed");
        }

        fs.writeFileSync(SEED_PATH, seed);

        return true;
    } catch (err) {
        console.error("Seed decryption failed:", err);
        return false;
    }
}

function seedExists() {
    return fs.existsSync(SEED_PATH);
}

function loadSeed() {
    return fs.readFileSync(SEED_PATH, "utf8").trim();
}

function get2FACode(hexSeed) {
    const code = generateTotpCode(hexSeed);

    const now = Math.floor(Date.now() / 1000);
    const validFor = 30 - (now % 30);

    return { code, validFor };
}

function verify2FA(hexSeed, code) {
    return verifyTotpCode(hexSeed, code, 1); // ±30s tolerance
}

module.exports = {
    decryptSeed,
    seedExists,
    loadSeed,
    get2FACode,
    verify2FA,
};