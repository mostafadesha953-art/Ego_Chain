// src/assets-manager.js
const SUPPORTED_ASSETS = {
    USDT: { symbol: "USDT", decimals: 6, isFeeToken: true },
    AURA: { symbol: "AURA", decimals: 8, isFeeToken: false },
    JEWEL: { symbol: "JWL", decimals: 18, isFeeToken: false }
};

class AssetManager {
    constructor() {
        this.userBalances = { "USDT": 0, "AURA": 0, "JEWEL": 0 };
    }

    // إضافة رصيد بعد التأكد من الشحن
    addBalance(asset, amount) {
        if (SUPPORTED_ASSETS[asset]) {
            this.userBalances[asset] += parseFloat(amount);
            return true;
        }
        return false;
    }
}

module.exports = { AssetManager, SUPPORTED_ASSETS };