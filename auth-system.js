const fs = require('fs');
const crypto = require('crypto');

function hashFunction(key) {
    return crypto.createHash('md5').update(key).digest('hex');
}

function verifyUserAccess(id, pass) {
    try {
        const userData = JSON.parse(fs.readFileSync('./database/users.json', 'utf8'));
        const user = userData.find(u => u.id === id || u.phone === id);

        if (user && user.keyHash === hashFunction(pass)) {
            console.log("Access Granted to Wallet:", user.walletAddress);
            return { success: true, wallet: user.walletAddress };
        } else {
            console.log("Access Denied: Invalid Credentials");
            return { success: false };
        }
    } catch (error) {
        console.error("Auth Error:", error);
        return { success: false };
    }
}

module.exports = { verifyUserAccess };