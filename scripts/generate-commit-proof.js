const fs = require("fs");
const crypto = require("crypto");
const { execSync } = require("child_process");

function getLatestCommitHash() {
    const hash = execSync("git log -1 --format=%H", { encoding: "utf8" }).trim();

    if (!/^[0-9a-f]{40}$/.test(hash)) {
        throw new Error("Invalid commit hash format: " + hash);
    }

    return hash;
}

function signMessage(commitHash, privateKeyPem) {
    // CRITICAL — sign ASCII string
    const messageBuffer = Buffer.from(commitHash, "utf8");

    const signature = crypto.sign("sha256", messageBuffer, {
        key: privateKeyPem,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX, // FIXED
    });

    return signature;
}

function encryptWithPublicKey(dataBuffer, publicKeyPem) {
    return crypto.publicEncrypt(
        {
            key: publicKeyPem,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        dataBuffer
    );
}

function main() {
    const commitHash = getLatestCommitHash();

    const studentPrivateKey = fs.readFileSync("./keys/student_private.pem", "utf8");

    const signature = signMessage(commitHash, studentPrivateKey);

    const instructorPublicKey = fs.readFileSync("./keys/instructor_public.pem", "utf8");

    const encryptedSignature = encryptWithPublicKey(signature, instructorPublicKey);

    const encryptedSignatureB64 = encryptedSignature.toString("base64");

    console.log("Commit Hash:");
    console.log(commitHash);
    console.log("\nEncrypted Signature (Base64):");
    console.log(encryptedSignatureB64);
}

main();