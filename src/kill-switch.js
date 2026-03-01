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
    isSupplyLocked = true;
    console.warn(تحذير: تم قفل عقد العملة ${tokenAddress} نهائياً.);
    return true;
}
