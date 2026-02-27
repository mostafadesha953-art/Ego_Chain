const fs = require('fs');
const crypto = require('crypto');

// التأكد من أن آخر كتلة في البلوكتشين مرتبطة بالتي قبلها بشكل صحيح
function verifyChain() {
    const chainData = JSON.parse(fs.readFileSync('./database/chain.json', 'utf8'));
    
    for (let i = 1; i < chainData.length; i++) {
        const currentBlock = chainData[i];
        const previousBlock = chainData[i - 1];

        if (currentBlock.previousHash !== previousBlock.hash) {
            console.error("CRITICAL: Blockchain Integrity Violated!");
            process.exit(1); // إيقاف النشر فوراً
        }
    }
    console.log("Integrity Verified. Proceeding to Cloud Deployment...");
}

verifyChain();