// src/wallet-core.js
const crypto = require('crypto');

class MultiCurrencyWallet {
    constructor() {
        this.balances = {
            "USDT": 0,
            "EGO_COIN": 0 // اسم افتراضي لعملتك الخاصة
        };
    }

    // إضافة رصيد (إيداع)
    deposit(currency, amount) {
        if (this.balances[currency] !== undefined) {
            this.balances[currency] += amount;
            return true;
        }
        return false;
    }

    // دفع الرسوم (1 USDT)
    payContractFee() {
        const fee = 1; // رسوم العقد الذكي
        if (this.balances["USDT"] >= fee) {
            this.balances["USDT"] -= fee;
            console.log(Fee Paid: ${fee} USDT. Remaining: ${this.balances["USDT"]});
            return { status: "PAID", txId: crypto.randomBytes(16).toString('hex') };
        } else {
            throw new Error("Insufficient USDT balance. Please deposit 1 USDT.");
        }
    }
}

module.exports = MultiCurrencyWallet;