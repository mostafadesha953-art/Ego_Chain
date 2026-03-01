// src/kill-switch.js - محرك الحماية النهائي لشبكة EGO Chain
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

const db = getFirestore();
let localSupplyLocked = false; // حماية إضافية على مستوى المتصفح

export const KillSwitchEngine = {
    
    // 1. قفل سقف العملة للأبد في السحابة (Firebase)
    async lockTokenSupplyForever(tokenAddress) {
        if (localSupplyLocked) return "خطأ: السقف مغلق بالفعل في الجلسة الحالية!";

        try {
            const tokenRef = doc(db, "tokens", tokenAddress);
            
            // التحديث في Firebase لضمان القفل لجميع المستخدمين للأبد
            await updateDoc(tokenRef, {
                isSupplyLocked: true,
                lockedAt: new Date().toISOString(),
                status: "FINALIZED", // حالة العقد النهائية
                mintingAllowed: false
            });

            localSupplyLocked = true;
            console.warn(🔒 تحذير أمني: تم قفل عقد العملة ${tokenAddress} نهائياً.);
            return true;
        } catch (error) {
            console.error("❌ فشل قفل السقف في السحابة:", error);
            return false;
        }
    },

    // 2. فحص حالة الشبكة (بديل لـ GlobalKillSwitch)
    async checkNetworkStatus(tokenAddress) {
        try {
            const tokenRef = doc(db, "tokens", tokenAddress);
            const snap = await getDoc(tokenRef);
            
            if (snap.exists() && snap.data().status === "HALTED") {
                console.error("⛔ النظام متوقف حالياً بأمر من الإدارة (HALTED).");
                return "HALTED";
            }
            return "ACTIVE";
        } catch (e) {
            return "OFFLINE";
        }
    },

    // 3. التحقق السريع قبل أي عملية تعدين أو إصدار جديد
    isLockedLocal() {
        return localSupplyLocked;
    }
};

// تصدير الدالة المنفردة للتوافق مع الأكواد السابقة
export const lockTokenSupplyForever = KillSwitchEngine.lockTokenSupplyForever;
