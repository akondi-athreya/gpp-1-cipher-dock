const fs = require("fs");
const { generateTotpCode, verifyTotpCode } = require("../src/crypto/totp");

const hexSeed = fs.readFileSync("/data/seed.txt", "utf8").trim();

console.log("Loaded seed:", hexSeed);

const code = generateTotpCode(hexSeed);
console.log("Generated TOTP:", code);

const isValid = verifyTotpCode(hexSeed, code);
console.log("Verification:", isValid);