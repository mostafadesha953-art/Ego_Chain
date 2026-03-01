const axios = require('axios');
class GlobalKillSwitch {
    constructor(url) { this.statusUrl = url; this.isSystemHalted = false; }
    async checkNetworkStatus() {
        try {
            const res = await axios.get(this.statusUrl);
            if (res.data.network === "HALTED") { this.isSystemHalted = true; return "HALTED"; }
            return "ACTIVE";
        } catch (e) { return "OFFLINE"; }
    }
}

module.exports = GlobalKillSwitch;

// src/kill-switch.js
let isSupplyLocked = false;

function lockTokenSupplyForever(tokenAddress) {
    if (isSupplyLocked) return "خطأ: السقف مغلق بالفعل!";
    
    // منطق برمجي يمنع أي وظيفة Minting (صك عملات جديدة)

    // src/kill-switch.js
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const db = getFirestore();

export async function lockTokenSupplyForever(tokenAddress) {
    try {
        const tokenRef = doc(db, "tokens", tokenAddress);
        
        // تحديث حالة القفل في قاعدة البيانات السحابية للأبد
        await updateDoc(tokenRef, {
            isSupplyLocked: true,
            lockedAt: new Date().toISOString(),
            status: "FINALIZED"
        });

        console.warn(تم قفل سقف العملة ${tokenAddress} في السحابة بنجاح.);
        return true;
    } catch (error) {
        console.error("خطأ في قفل السقف:", error);
        return false;
    }
}
    isSupplyLocked = true;
    console.warn(تحذير: تم قفل عقد العملة ${tokenAddress} نهائياً.);
    return true;
}

