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

// wallet-core.js - المحرك الرئيسي للمحفظة والهوية
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export const EgoWallet = {
    // 1. إنشاء محفظة فريدة مرتبطة بالهاتف أو الإيميل
    async createWallet(userId, userData) {
        const walletRef = doc(db, "wallets", userId);
        const snap = await getDoc(walletRef);
        
        if (!snap.exists()) {
            await setDoc(walletRef, {
                owner: userData.identifier, // إيميل أو هاتف
                balance: 0,
                minedBeforeSync: 0,
                createdAt: new Date().toISOString(),
                status: "ACTIVE"
            });
            console.log("تم إنشاء المحفظة بنجاح.");
        }
    },

    // 2. تحديث الرصيد المعدّن "محلياً" قبل الرفع
    updateLocalMining(amount) {
        let current = parseFloat(localStorage.getItem('ego_mined')) || 0;
        localStorage.setItem('ego_mined', current + amount);
        return current + amount;
    },

    // 3. دمج العملات المرفوعة مع العقد الذكي المنشئ (Sync to Chain)
    async syncMinedToNetwork() {
        const user = auth.currentUser;
        if (!user) throw new Error("يجب تسجيل الدخول أولاً!");

        const minedAmount = parseFloat(localStorage.getItem('ego_mined')) || 0;
        if (minedAmount <= 0) return alert("لا يوجد رصيد تعدين للرفع.");

        try {
            const walletRef = doc(db, "wallets", user.uid);
            
            // دمج العملات في المحفظة الإلكترونية وتصفير العداد المحلي
            await updateDoc(walletRef, {
                balance: increment(minedAmount),
                lastSync: new Date().toISOString()
            });

            localStorage.setItem('ego_mined', 0); // تصفير الرصيد المحلي بعد الرفع
            alert(تم بنجاح رفع ${minedAmount} عملة إلى شبكة EGOChain ودمجها بالعقد.);
        } catch (error) {
            console.error("فشل الرفع للشبكة:", error);
        }
    }
};
