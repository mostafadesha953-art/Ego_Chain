// src/scarcity-engine.js - محرك الندرة وتضييق الهاش الموحد

export class ScarcityEngine {
    constructor(maxSupply = 100000000) {
        this.MAX_SUPPLY = maxSupply;
        this.FLOOR_SPEED = 0.0000005; // أدنى سرعة عند 95%
    }

    /**
     * 1. تحليل مقاييس الندرة (Aura & Jewel)
     * يعتمد على البيانات القادمة من البلوكتشين (Firestore)
     */
    calculateMetrics(allTransactions) {
        let totalAuraTax = 0;
        let totalJewelTax = 0;

        allTransactions.forEach(tx => {
            if (tx.asset === "AURA") totalAuraTax += tx.tax || 0;
            if (tx.asset === "JEWEL") totalJewelTax += tx.tax || 0;
        });

        return {
            AURA: {
                locked: totalAuraTax.toFixed(2),
                scarcityBoost: (totalAuraTax * 0.05).toFixed(2) + "%" // زيادة 5% لكل وحدة ضريبية
            },
            JEWEL: {
                locked: totalJewelTax.toFixed(2),
                scarcityBoost: (totalJewelTax * 0.03).toFixed(2) + "%" // زيادة 3% لكل وحدة ضريبية
            }
        };
    }

    /**
     * 2. بروتوكول تضييق الهاش للأجهزة الخارجية
     * يفرض قيوداً على السرعة بناءً على سقف العملة
     */
    getAllowedHashRate(currentMinedTotal) {
        let percentage = (currentMinedTotal / this.MAX_SUPPLY) * 100;

        // التضييق الأقصى عند 95%
        if (percentage >= 95) {
            return this.FLOOR_SPEED;
        }

        // التضييق التدريجي: تقليل السرعة 20% عند كل زيادة 5% في التعدين
        let baseRate = 1.0;
        let steps = Math.floor(percentage / 5);
        let allowedRate = baseRate * Math.pow(0.8, steps);

        return allowedRate;
    }
}
