const { generateKeyPairSync } = require("crypto");

module.exports = function generateRSAKeyPair() {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicExponent: 0x10001, // 65537
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });

    return {
        publicKeyPem: publicKey,
        privateKeyPem: privateKey,
    };
};