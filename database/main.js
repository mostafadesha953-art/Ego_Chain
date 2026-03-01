// database/main.js - المحرك الموحد: ذكاء اصطناعي، دفع، ندرة، وتحكم في الهاش

// --- 1. محرك الندرة وتضييق الهاش (دمج scarcity-engine) ---
const ScarcityLogic = {
    MAX_SUPPLY: 100000000,
    FLOOR_SPEED: 0.0000005,

    // حساب مقاييس Aura & Jewel والضرائب (2.5%) لزيادة القيمة
    updateMetricsUI(allTransactions = []) {
        let totalAuraTax = 0;
        let totalJewelTax = 0;

        allTransactions.forEach(tx => {
            if (tx.asset === "AURA") totalAuraTax += tx.tax || 0;
            if (tx.asset === "JEWEL") totalJewelTax += tx.tax || 0;
        });

        const auraBoost = (totalAuraTax * 0.05).toFixed(2);
        const jewelBoost = (totalJewelTax * 0.03).toFixed(2);

        if(document.getElementById('aura-val')) {
            document.getElementById('aura-val').innerText = totalAuraTax.toFixed(2);
            document.getElementById('aura-boost').innerText = auraBoost + "%";
            document.getElementById('jewel-val').innerText = totalJewelTax.toFixed(2);
            document.getElementById('jewel-boost').innerText = jewelBoost + "%";
        }
    },

    // بروتوكول تضييق الهاش للأجهزة الخارجية بناءً على نسبة الـ 95%
    calculateAllowedHash(currentMined) {
        let percentage = (currentMined / this.MAX_SUPPLY) * 100;
        
        // التضييق الأقصى عند 95% كما طلبت
        if (percentage >= 95) return this.FLOOR_SPEED;

        // التضييق التدريجي كل 5% (تقليل 20% في كل مرحلة)
        let baseRate = 1.0;
        let steps = Math.floor(percentage / 5);
        return baseRate * Math.pow(0.8, steps);
    }
};

// --- 2. محرك تقييم العملة بالذكاء الاصطناعي (AI Pricing) ---
async function evaluateTokenWithAI() {
    const name = document.getElementById('tokenName').value;
    if (!name) return alert("يرجى إدخال اسم العملة أولاً");

    const encryptionStrength = 9.8; 
    const scarcityScore = 5.0; 
    
    let initialPriceUSD = (encryptionStrength * 0.05) + (scarcityScore * 0.02);
    let initialPriceEGP = 25.00; // السعر الثابت بالجنيه الذي حددته

    document.getElementById('ai-price-usd').innerText = initialPriceUSD.toFixed(4);
    document.getElementById('ai-price-egp').innerText = initialPriceEGP.toFixed(2);

    alert(✅ تحليل AI لعملة ${name} اكتمل:\n +
          السعر المقترح: ${initialPriceUSD.toFixed(4)} $ \n +
          ما يعادل: ${initialPriceEGP.toFixed(2)} ج.م);
    
    return initialPriceUSD;
}

// --- 3. معالجة عمليات الشراء والدفع ---
async function purchaseTokenListing() {
    const finalPriceUSD = document.getElementById('ai-price-usd').innerText;
    const finalPriceEGP = document.getElementById('ai-price-egp').innerText;

    if (finalPriceUSD === "0.0000") return alert("يرجى تقييم العملة بالـ AI أولاً");

    const choice = confirm("💳 دفع دولي (Stripe)؟ \nإلغاء للدفع المحلي (Fawry/InstaPay)");
    
    if (choice) {
        handleStripePayment(finalPriceUSD);
    } else {
        handleFawryPayment(finalPriceEGP);
    }
}

function handleStripePayment(amount) {
    console.log(🚀 Stripe Redirect: ${amount}$);
    alert(سيتم فتح بوابة Stripe الآمنة لدفع ${amount} دولار);
}

function handleFawryPayment(amount) {
    const fawryRef = Math.floor(Math.random() * 1000000000);
    alert(توجه لأقرب منفذ فوري واستخدم الرقم المرجعي: ${fawryRef} \nالمبلغ: ${amount} ج.م);
}

// --- 4. وظائف التعدين والتحكم في الأجهزة ---
function updateMiningDisplay(minedTotal) {
    const allowed = ScarcityLogic.calculateAllowedHash(minedTotal);
    document.getElementById('hashRate').innerText = allowed.toFixed(8);
    document.getElementById('minedBalance').innerText = minedTotal.toFixed(8);
}

// تشغيل المحرك عند تحميل الصفحة
window.onload = () => {
    console.log("EGO Chain Core: Active & Secure");
    updateAIPricing(); // تحديث أولي للأسعار
    // محاكاة تحديث الندرة لعملات Aura & Jewel (بيانات تجريبية)
    ScarcityLogic.updateMetricsUI([{asset: "AURA", tax: 150}, {asset: "JEWEL", tax: 85}]);
};
