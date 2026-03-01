const crypto = require('crypto');

class Transaction {
    constructor(from, to, amount, signature, authMessage = null) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.signature = signature; // Private Key Signing
        this.authMessage = authMessage; // "Trade/Buy" authorization
        this.timestamp = Date.now();
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
            .digest('hex');
    }
}

class EgoChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block(Date.now(), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // ميزة رد الحقوق: Revert Transaction Logic
    revertAssets(stolenFrom, currentHolder, amount, privateKey) {
        // التحقق من وجود رسالة توثيق (Auth Message)
        const hasAuth = this.chain.some(block => 
            block.transactions.some(tx => 
                tx.from === stolenFrom && tx.to === currentHolder && tx.authMessage !== null
            )
        );

        if (!hasAuth) {
            console.log("ALERT: No Auth Message found. Reverting funds to original owner...");
            this.addTransaction(new Transaction(currentHolder, stolenFrom, amount, 'SYSTEM_RECOVERY'));
            return true;
        }
        console.log("Transaction is valid and authorized.");
        return false;
    }

    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions() {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.hash = block.calculateHash();
        this.chain.push(block);
        this.pendingTransactions = [];
    }
}


module.exports = { EgoChain, Transaction };

// logic for AI Pricing
async function estimateInitialPrice(encryptionStrength, featuresCount) {
    // محاكاة منطق AI
    let basePrice = 0.01; // سعر مبدئي بالسنت
    let multiplier = (encryptionStrength * 0.5) + (featuresCount * 0.2);
    let finalPriceUSD = basePrice * multiplier;
    
    return {
        usd: finalPriceUSD.toFixed(4),
        egp: (finalPriceUSD * 50).toFixed(2) // سعر افتراضي للصرف
    };
}
