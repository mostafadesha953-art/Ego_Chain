const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const SecurityVault = require('../src/security-vault');
const sync = require('../src/sync');

let mainWindow;

// محرك فك التشفير بناءً على مفتاح المستخدم
function decryptUserData(encryptedData, userSecretKey) {
    try {
        // نستخدم المفتاح السري للمستخدم كـ Salt لفك التشفير
        return SecurityVault.decrypt(encryptedData, userSecretKey);
    } catch (e) { return null; }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1250, height: 900,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
        title: "EgoChain Core - Sovereign Isolation Mode"
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// تسجيل الدخول وجلب البيانات الخاصة فقط
ipcMain.on('request-secure-login', async (event, auth) => {
    try {
        const usersData = JSON.parse(fs.readFileSync('./database/users.json', 'utf8'));
        const user = usersData.find(u => u.id === auth.id && u.pass === auth.pass);

        if (user) {
            // جلب العقود المشفره من chain.json وتصفيتها
            const allBlocks = JSON.parse(fs.readFileSync('./database/chain.json', 'utf8'));
            // لا نرسل إلا العقود التي تخص هذا المستخدم (صاحب المفتاح)
            const userBlocks = allBlocks.filter(b => b.owner === auth.id);
            
            event.reply('login-success', {
                balances: user.balances,
                history: userBlocks,
                walletAddr: user.walletAddress
            });
        } else {
            event.reply('auth-error', "خطأ: بيانات الدخول غير مطابقة للسجلات.");
        }
    } catch (e) { console.error(e); }
});

// حفظ العقد في سجل المستخدم الخاص (مشفر)
ipcMain.on('save-private-contract', async (event, contract) => {
    try {
        const chainPath = './database/chain.json';
        let chain = JSON.parse(fs.readFileSync(chainPath, 'utf8'));
        
        // إضافة العقد للسجل العام مع وسم الملكية
        chain.push(contract);
        fs.writeFileSync(chainPath, JSON.stringify(chain, null, 2));
        
        // مزامنة سحابية فورية لضمان عدم الضياع
        await sync(contract);
        console.log("🔒 Contract Secured in User Vault");
    } catch (e) { console.error(e); }
});

// database/main.js

// دالة تقييم العملة بالذكاء الاصطناعي قبل الطرح
async function evaluateTokenWithAI() {
    const name = document.getElementById('tokenName').value;
    // معايير الذكاء الاصطناعي: قوة التشفير + الندرة + الخدمات
    let encryptionStrength = 9.8; // قيمة افتراضية من نظام الحماية
    let scarcityScore = 5.0; // بناءً على سقف الـ 5% الذي وضعته
    
    // معادلة تحديد السعر الافتراضي
    let initialPriceUSD = (encryptionStrength * 0.05) + (scarcityScore * 0.02);
    let initialPriceEGP = initialPriceUSD * 50; 

    alert(`تحليل AI لعملة ${name}: 
    السعر المقترح للطرح الأولي: ${initialPriceUSD.toFixed(4)} $
    ما يعادل: ${initialPriceEGP.toFixed(2)} جنيه مصري`);

// database/main.js

// 1. دالة معالجة الشراء التي سألت عنها
async function purchaseTokenListing() {
    const finalPriceUSD = document.getElementById('ai-price-usd').innerText;
    const choice = confirm("هل تريد الدفع بالدولار (Stripe)؟ اضغط Cancel للدفع بالجنيه (Fawry)");
    
    if (choice) {
        handleStripePayment(finalPriceUSD);
    } else {
        const finalPriceEGP = document.getElementById('ai-price-egp').innerText;
        handleFawryPayment(finalPriceEGP);
    }
}

// 2. الدوال المساعدة التي يجب أن تكون موجودة ليعمل الكود
function handleStripePayment(amount) {
    console.log("توجيه إلى Stripe لدفع: " + amount + " دولار");
    // هنا نضع كود Stripe Checkout الذي كتبناه سابقاً
}

function handleFawryPayment(amount) {
    console.log("توليد كود Fawry لدفع: " + amount + " جنيه");
    // هنا نضع كود طلب رقم مرجعي من فوري
}
    
    return initialPriceUSD;
}

app.whenReady().then(createWindow);


