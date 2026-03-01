// src/tokenomics-engine.js
const MAX_SUPPLY = 100000000; // مثال: سقف العملة
let currentSupply = 0;

function calculateHashRate(currentSupply) {
    let percentage = (currentSupply / MAX_SUPPLY) * 100;
    let baseRate = 1.0; // السرعة الأساسية

    if (percentage >= 95) {
        return 0.0000005; // أدنى سرعة عند الوصول لـ 95%
    }

    // تقليل السرعة بنسبة معينة كلما زاد التعدين 5%
    let reductionSteps = Math.floor(percentage / 5);
    let currentRate = baseRate * Math.pow(0.8, reductionSteps); // يقل بنسبة 20% كل خطوة

    return currentRate;
}

// خاصية قفل السقف للأبد
function lockSupplyForever() {
    Object.freeze(MAX_SUPPLY);
    console.log("تم قفل سقف العملة نهائياً.");
}
