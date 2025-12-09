const { totp } = require("otplib");
const base32 = require("hi-base32");

function verifyTotpCode(hexSeed, code, validWindow = 1) {
    if (!/^[0-9a-f]{64}$/.test(hexSeed)) {
        throw new Error("Invalid hex seed.");
    }
    if (!/^[0-9]{6}$/.test(code)) {
        throw new Error("Invalid TOTP code. Must be 6 digits.");
    }

    const seedBytes = Buffer.from(hexSeed, "hex");
    const base32Seed = base32.encode(seedBytes).replace(/=/g, "");

    totp.options = {
        digits: 6,
        step: 30,
        algorithm: "sha1",
        window: validWindow
    };

    return totp.check(code, base32Seed);
}

module.exports = { verifyTotpCode };