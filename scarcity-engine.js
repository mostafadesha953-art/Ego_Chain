// src/scarcity-engine.js
const fs = require('fs');

class ScarcityEngine {
    calculateMetrics() {
        const chain = JSON.parse(fs.readFileSync('./database/chain.json', 'utf8'));
        let totalAuraLocked = 0;
        let totalJewelLocked = 0;

        // تحليل كل الكتل وحساب الضرائب المتراكمة (2.5%)
        chain.forEach(block => {
            if (block.asset === "AURA") totalAuraLocked += block.tax || 0;
            if (block.asset === "JEWEL") totalJewelLocked += block.tax || 0;
        });

        return {
            AURA: {
                locked: totalAuraLocked.toFixed(2),
                scarcityBoost: (totalAuraLocked * 0.05).toFixed(2) + "%" // معادلة فرضية لزيادة القيمة
            },
            JEWEL: {
                locked: totalJewelLocked.toFixed(2),
                scarcityBoost: (totalJewelLocked * 0.03).toFixed(2) + "%"
            }
        };
    }
}

module.exports = new ScarcityEngine();