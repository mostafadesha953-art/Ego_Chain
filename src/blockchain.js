// src/blockchain.js - المحرك الرئيسي لشبكة EGO Chain

export class Transaction {
    constructor(from, to, amount, signature, authMessage = null) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.signature = signature; // التوقيع الرقمي بالمفتاح الخاص
        this.authMessage = authMessage; // رسالة التوثيق (Trade/Buy)
        this.timestamp = Date.now();
    }
}

export class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = ""; // سيتم حسابه لاحقاً
    }

    // حساب الهاش باستخدام Web Crypto API المتوافقة مع المتصفحات
    async calculateHash() {
        const data = this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce;
        const msgUint8 = new TextEncoder().encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

export class EgoChain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.init();
    }

    async init() {
        const genesis = new Block(Date.now(), [], "0");
        genesis.hash = await genesis.calculateHash();
        this.chain.push(genesis);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * ميزة رد الحقوق (Revert Transaction Logic)
     * إذا لم يوجد توثيق (Auth Message) يتم إعادة الأموال للمالك الأصلي تلقائياً
     */
    async revertAssets(stolenFrom, currentHolder, amount) {
        const hasAuth = this.chain.some(block => 
            block.transactions.some(tx => 
                tx.from === stolenFrom && tx.to === currentHolder && tx.authMessage !== null
            )
        );

        if (!hasAuth) {
            console.warn("⚠️ تنبيه أمني: لا توجد رسالة توثيق. يتم استرداد الأموال للمالك الأصلي...");
            this.addTransaction(new Transaction(currentHolder, stolenFrom, amount, 'SYSTEM_RECOVERY_REVERT'));
            await this.minePendingTransactions();
            return true;
        }
        console.log("✅ المعاملة موثقة وقانونية.");
        return false;
    }

    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    async minePendingTransactions() {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.hash = await block.calculateHash();
        this.chain.push(block);
        this.pendingTransactions = [];
        return block;
    }
}

/**
 * محرك تسعير الذكاء الاصطناعي (AI Pricing)
 */
export async function estimateInitialPrice(encryptionStrength, featuresCount) {
    const basePrice = 0.01; // سعر مبدئي 1 سنت
    // المعادلة: القوة التشفيرية (مثلاً 9.😎 + عدد المزايا
    let multiplier = (encryptionStrength * 0.5) + (featuresCount * 0.2);
    let finalPriceUSD = basePrice * multiplier;
    
    return {
        usd: finalPriceUSD.toFixed(4),
        egp: (finalPriceUSD * 50).toFixed(2) // التحويل للجنيه المصري
    };
}
