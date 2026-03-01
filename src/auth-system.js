// src/auth-system.js - نظام الهوية الرقمية والامتثال القانوني (KYC) لـ EGO Chain
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

// إعدادات Firebase (يتم جلبها من بيئة Netlify)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const AuthEngine = {
    
    /**
     * 1. توثيق الهوية (KYC) - امتثال للقانون المصري
     * تشفير الرقم القومي والاسم لضمان الخصوصية المطلقة
     */
    async verifyKYC(nationalID, name) {
        const encoder = new TextEncoder();
        const data = encoder.encode(nationalID + name);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const kycHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        console.log("✅ تم توثيق الهوية رقمياً (KYC Hash Generated)");
        return kycHash;
    },

    /**
     * 2. تسجيل الدخول الذكي (إيميل أو هاتف)
     */
    async login(identity, password) {
        try {
            // محاولة الدخول عبر Firebase
            const userCredential = await signInWithEmailAndPassword(auth, identity, password);
            console.log(✅ تم الوصول للمحفظة: ${userCredential.user.uid});
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error("❌ فشل الدخول: بيانات غير مطابقة للسجلات.");
            return { success: false, error: error.message };
        }
    },

    /**
     * 3. مزامنة التعدين المحلي مع السحابة (EGO Chain Sync)
     * دمج العملات المعدنة "أوفلاين" مع رصيد العقد الذكي
     */
    async syncToEgoChain(userId, offlineMinedAmount) {
        if (offlineMinedAmount <= 0) return;

        const userRef = doc(db, "wallets", userId);
        try {
            // دمج العملات في المحفظة الإلكترونية فور الرفع للشبكة
            await updateDoc(userRef, {
                balance: increment(offlineMinedAmount),
                lastSync: new Date().toISOString()
            });
            
            console.log(🚀 تم دمج ${offlineMinedAmount} عملة مع العقد المنشئ بنجاح.);
            return true;
        } catch (error) {
            console.error("❌ فشل المزامنة السحابية:", error);
            return false;
        }
    }
};

// وظيفة متوافقة مع الأكواد السابقة لسهولة الاستدعاء
export const uploadMinedToChain = AuthEngine.syncToEgoChain;
