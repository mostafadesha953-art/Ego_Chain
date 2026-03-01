// src/wallet-core.js - المحرك الموحد للمحفظة والهوية والرسوم
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export const EgoWallet = {
    // 1. إنشاء محفظة فريدة مرتبطة بالهاتف أو الإيميل (Firebase)
    async createWallet(userId, userData) {
        const walletRef = doc(db, "wallets", userId);
        const snap = await getDoc(walletRef);
        
        if (!snap.exists()) {
            await setDoc(walletRef, {
                owner: userData.identifier, // إيميل أو هاتف
                balances: {
                    "EGO_COIN": 0,
                    "USD_CREDIT": 0, // الرصيد بالدولار
                    "EGP_CREDIT": 0  // الرصيد بالجنيه
                },
                minedBeforeSync: 0,
                createdAt: new Date().toISOString(),
                status: "ACTIVE"
            });
            console.log("✅ تم إنشاء المحفظة الرقمية بنجاح.");
        }
    },

    // 2. دفع رسوم العقد (0.5 دولار) باستخدام الرصيد المعبأ
    async payContractFee() {
        const user = auth.currentUser;
        if (!user) throw new Error("يجب تسجيل الدخول أولاً!");
        
        const fee = 0.5; // السعر الذي حددته للعقد
        const walletRef = doc(db, "wallets", user.uid);
        const snap = await getDoc(walletRef);
        
        if (snap.exists() && snap.data().balances.USD_CREDIT >= fee) {
            await updateDoc(walletRef, {
                "balances.USD_CREDIT": increment(-fee)
            });
            
            // توليد توقيع فريد للعملية (بديلاً عن crypto.randomBytes)
            const txId = btoa(Math.random().toString()).substring(0, 16);
            console.log(💰 تم دفع الرسوم: ${fee}$ | رقم العملية: ${txId});
            return { status: "PAID", txId: txId };
        } else {
            throw new Error("عفواً: رصيدك غير كافٍ. يرجى الشحن أولاً (0.5 دولار).");
        }
    },

    // 3. تحديث الرصيد المعدّن "محلياً" (Local Storage)
    updateLocalMining(amount) {
        let current = parseFloat(localStorage.getItem('ego_mined')) || 0;
        let newTotal = current + amount;
        localStorage.setItem('ego_mined', newTotal);
        return newTotal;
    },

    // 4. دمج العملات المرفوعة (Sync) مع العقد الذكي في الشبكة
    async syncMinedToNetwork() {
        const user = auth.currentUser;
        if (!user) throw new Error("يجب تسجيل الدخول!");

        const minedAmount = parseFloat(localStorage.getItem('ego_mined')) || 0;
        if (minedAmount <= 0) return alert("لا يوجد رصيد تعدين للرفع.");

        try {
            const walletRef = doc(db, "wallets", user.uid);
            
            // دمج العملات وتصفير العداد المحلي
            await updateDoc(walletRef, {
                "balances.EGO_COIN": increment(minedAmount),
                lastSync: new Date().toISOString()
            });

            localStorage.setItem('ego_mined', 0);
            alert(✅ تم بنجاح دمج ${minedAmount.toFixed(8)} عملة في محفظتك الإلكترونية.);
        } catch (error) {
            console.error("فشل الرفع للشبكة:", error);
        }
    }
};
