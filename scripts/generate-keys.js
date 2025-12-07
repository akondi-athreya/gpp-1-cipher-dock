const fs = require("fs");
const path = require("path");
const generateRSAKeyPair = require("../src/crypto/rsa/generate");

(async () => {
    console.log("Generating Student RSA 4096-bit Key Pair...");

    const { publicKeyPem, privateKeyPem } = await generateRSAKeyPair();

    const outDir = path.join(__dirname, "..", "keys");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

    fs.writeFileSync(path.join(outDir, "student_private.pem"), privateKeyPem);
    fs.writeFileSync(path.join(outDir, "student_public.pem"), publicKeyPem);

    console.log("✔ Keys generated successfully.");
    console.log("✔ Saved to /keys directory.");
})();