const fs = require("fs");
const crypto = require("crypto");

function decrypt_seed(encrypted_seed_b64, privateKeyPem) {
    const encryptedBuffer = Buffer.from(encrypted_seed_b64, "base64");

    const decrypted = crypto.privateDecrypt(
        {
            key: privateKeyPem,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        encryptedBuffer
    );

    const seed = decrypted.toString("utf8").trim();

    // Validation
    if (seed.length !== 64) {
        throw new Error("Decrypted seed is not 64 characters long.");
    }

    if (!/^[0-9a-f]{64}$/.test(seed)) {
        throw new Error("Decrypted seed is not valid hexadecimal.");
    }

    return seed;
}


const encryptedSeed = fs.readFileSync("./keys/encrypted_seed.txt", "utf8").trim();
const privateKeyPem = fs.readFileSync("./keys/student_private.pem", "utf8");

const seed = decrypt_seed(encryptedSeed, privateKeyPem);

// Output
fs.writeFileSync("/data/seed.txt", seed);
console.log("Decrypted seed written to /data/seed.txt");