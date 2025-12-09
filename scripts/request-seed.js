const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_URL = "https://eajeyq4r3zljoq4rpovy2nthda0vtjqf.lambda-url.ap-south-1.on.aws";

async function requestSeed(studentId, githubRepoUrl) {
    try {
        const publicKeyPath = path.join(__dirname, "..", "keys", "student_public.pem");
        const publicKey = fs.readFileSync(publicKeyPath, "utf8");

        const payload = {
            student_id: studentId,
            github_repo_url: githubRepoUrl,
            public_key: publicKey,
        };

        console.log("Sending request to Instructor API...");
        
        const response = await axios.post(API_URL, payload, {
            headers: { 
                "Content-Type": "application/json"
            },
            timeout: 15000,
        });

        if (!response.data || !response.data.encrypted_seed) {
            console.error("Invalid response:", response.data);
            return;
        }

        const encryptedSeed = response.data.encrypted_seed;

        // save the encrypted seed in keys folder
        const outputFile = path.join(__dirname, "..", "keys", "encrypted_seed.txt");
        fs.writeFileSync(outputFile, encryptedSeed);

        console.log("✔ Encrypted seed saved to encrypted_seed.txt");
    } catch (err) {
        console.log(err);
        console.error("❌ Error requesting seed:", err.message);
    }
}

// EDIT THESE WITH YOUR DETAILS
const STUDENT_ID = "22MH1A42E7";
const GITHUB_REPO_URL = "https://github.com/akondi-athreya/gpp-1-cipher-dock";

requestSeed(STUDENT_ID, GITHUB_REPO_URL);