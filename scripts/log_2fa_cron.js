
const fs = require("fs");
const path = require("path");
const { generateTotpCode } = require("../src/crypto/totp/generate");

// 1. Read seed
const seedFile = "/data/seed.txt";

let hexSeed;
try {
    hexSeed = fs.readFileSync(seedFile, "utf8").trim();
} catch (err) {
    console.log(`${new Date().toISOString()} - ERROR: seed.txt not found`);
    process.exit(0);
}

// 2. Generate TOTP code
let code;
try {
    code = generateTotpCode(hexSeed);
} catch (err) {
    console.log(`${new Date().toISOString()} - ERROR: failed to generate TOTP`);
    process.exit(0);
}

// 3. Get current UTC timestamp
const now = new Date().toISOString().replace("T", " ").split(".")[0];

// 4. Output formatted log line
console.log(`${now} - 2FA Code: ${code}`);