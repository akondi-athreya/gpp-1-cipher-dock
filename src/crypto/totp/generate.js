const { totp } = require("otplib");
const base32 = require("hi-base32");

function generateTotpCode(hexSeed) {
    if (!/^[0-9a-f]{64}$/.test(hexSeed)) {
        throw new Error("Invalid hex seed. Must be 64 hex chars.");
    }

    // hex → bytes
    const seedBytes = Buffer.from(hexSeed, "hex");

    // bytes → base32 (otplib requires base32)
    const base32Seed = base32.encode(seedBytes).replace(/=/g, "");

    totp.options = {
        digits: 6,
        step: 30,
        algorithm: "sha1"
    };

    return totp.generate(base32Seed);
}

module.exports = { generateTotpCode };