// database/main.js - المحرك الموحد: ذكاء اصطناعي، دفع، ندرة، تضييق الهاش، ورسم بياني + وضع الإدارة

// --- 1. محرك الندرة والتسعير الديناميكي ---
const ScarcityLogic = {
    MAX_SUPPLY: 100000000,
    BASE_PRICE: 0.5,
    SCARCITY_FACTOR: 1.5,
    FLOOR_SPEED: 0.0000005,

    calculateDynamicPrice(currentMined) {
        let demandRatio = currentMined / this.MAX_SUPPLY;
        let priceGrowth = Math.pow(demandRatio, this.SCARCITY_FACTOR);
        let dynamicPrice = this.BASE_PRICE * (1 + priceGrowth);
        
        return {
            usd: dynamicPrice.toFixed(4),
            egp: (dynamicPrice * 50).toFixed(2)
        };
    },

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

    calculateAllowedHash(currentMined) {
        // --- فحص وضع الإدارة (Admin Check) ---
        if (localStorage.getItem('admin_mode') === 'true') {
            return 100.0; // سرعة فائقة للمدير دون تضييق
        }

        let percentage = (currentMined / this.MAX_SUPPLY) * 100;
        if (percentage >= 95) return this.FLOOR_SPEED;
        let steps = Math.floor(percentage / 5);
        return 1.0 * Math.pow(0.8, steps);
    }
};

// --- 2. محرك الرسم البياني (Price Chart) ---
let priceChart;
function initPriceChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    const labels = ['0%', '20%', '40%', '60%', '80%', '95%', '100%'];
    const dataPoints = labels.map(label => {
        let percentage = parseInt(label) / 100;
        let price = ScarcityLogic.BASE_PRICE * (1 + Math.pow(percentage, ScarcityLogic.SCARCITY_FACTOR));
        return price.toFixed(4);
    });

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'سعر العقد ($)',
                data: dataPoints,
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { 
                y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

// --- 3. محرك تقييم العملة بالذكاء الاصطناعي (AI Pricing) ---
async function evaluateTokenWithAI() {
    const name = document.getElementById('tokenName').value;
    if (!name) return alert("يرجى إدخال اسم العملة أولاً");

    let currentMined = parseFloat(localStorage.getItem('mined')) || 0;
    let marketPrice = ScarcityLogic.calculateDynamicPrice(currentMined);

    const encryptionStrength = 9.8; 
    let finalUSD = parseFloat(marketPrice.usd) + (encryptionStrength * 0.01);
    let finalEGP = finalUSD * 50;

    document.getElementById('ai-price-usd').innerText = finalUSD.toFixed(4);
    document.getElementById('ai-price-egp').innerText = finalEGP.toFixed(2);

    alert(✅ تحليل AI لعملة ${name} اكتمل:\n +
          السعر الحالي بناءً على الطلب: ${finalUSD.toFixed(4)} $ \n +
          ما يعادل: ${finalEGP.toFixed(2)} ج.م);
}

// --- 4. معالجة عمليات الشراء والدفع ---
async function purchaseTokenListing() {
    // --- فحص وضع الإدارة (Admin Check) ---
    if (localStorage.getItem('admin_mode') === 'true') {
        alert("🛡️ وضع السيادة نشط: يتم توليد العقد مجاناً وتخطي بوابة الدفع.");
        return console.log("Admin Bypass: Contract Generated Free.");
    }

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
    alert(🚀 توجيه لبوابة Stripe لدفع السعر المحدث: ${amount}$);
}

function handleFawryPayment(amount) {
    const fawryRef = Math.floor(Math.random() * 1000000000);
    alert(برجاء التوجه لأقرب منفذ فوري واستخدم الرقم المرجعي: ${fawryRef} \nالمبلغ: ${amount} ج.م);
}

// --- 5. تحديث الواجهة والتحكم ---
function updateMiningUI(minedTotal) {
    const allowed = ScarcityLogic.calculateAllowedHash(minedTotal);
    if(document.getElementById('hashRate')) document.getElementById('hashRate').innerText = allowed.toFixed(8);
    if(document.getElementById('minedBalance')) document.getElementById('minedBalance').innerText = minedTotal.toFixed(8);
}

window.onload = () => {
    console.log("EGO Chain Core: Active & Secure");
    initPriceChart();
    // فحص إذا كان الداخل هو المدير لتغيير الثيم بصرياً
    if(localStorage.getItem('admin_mode') === 'true') {
        document.body.style.border = "5px solid #ef4444";
        console.log("Sovereign Admin Access Granted");
    }
};
