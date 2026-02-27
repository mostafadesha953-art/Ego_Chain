const crypto = require('crypto');

class Wallet {
    static signTransaction(privateKey, data) {
        const sign = crypto.createSign('SHA256');
        sign.update(JSON.stringify(data));
        sign.end();
        return sign.sign(privateKey, 'hex');
    }

    static verifySignature(publicKey, data, signature) {
        const verify = crypto.createVerify('SHA256');
        verify.update(JSON.stringify(data));
        verify.end();
        return verify.verify(publicKey, signature, 'hex');
    }
}

// Logical structure for the "Auth Message" (Trade Key)
function createTradeAuth(privateKey, buyerPublicKey, amount) {
    const authData = {
        type: "OFFICIAL_TRADE",
        buyer: buyerPublicKey,
        amount: amount,
        timestamp: Date.now()
    };
    const tradeKey = Wallet.signTransaction(privateKey, authData);
    return { authData, tradeKey };
}

module.exports = { Wallet, createTradeAuth };