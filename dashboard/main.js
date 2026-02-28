const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const SecurityVault = require('../src/security-vault');
const sync = require('../src/sync');
const { AuraEngine, JewelEngine } = require('../src/tokenomics-engine');

let mainWindow;

// إعدادات أسعار الصرف السيادية
const ASSET_PRICES = {
    AURA: 0.63,
    JEWEL: 0.45
};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1250, height: 900,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
        title: "EgoChain Core - 21M Sovereign Edition",
        backgroundColor: '#0a0b0d'
    });
    mainWindow.loadFile('index.html');
}

// 1. محرك معالجة الشراء (Buy Logic - USDT Payment)
ipcMain.on('initiate-buy', async (event, purchaseData) => {
    try {
        const { asset, amount, cost } = purchaseData;
        const usersPath = path.join(__dirname, '../database/users.json');
        let users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        
        // تحديد المستخدم (يفضل ربطه بنظام تسجيل الدخول لاحقاً)
        let user = users[0]; 

        if (user.balances.USDT < cost) {
            return event.reply('transfer-error', "عذراً، رصيد USDT غير كافٍ.");
        }

        // تنفيذ المقاصة المالية
        user.balances.USDT -= cost;
        user.balances[asset] += parseFloat(amount);

        // حفظ البيانات محلياً وتحديث الواجهة
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        event.reply('balance-updated', user.balances);

        // توثيق العملية في البلوكتشين العالمي
        const buyRecord = {
            id: BUY-${crypto.randomBytes(2).toString('hex').toUpperCase()},
            type: "ASSET_PURCHASE",
            asset, amount, cost, time: Date.now()
        };
        await sync(buyRecord);

    } catch (err) {
        console.error("Buy Error:", err);
    }
});

// 2. محرك معالجة التحويل والضرائب (Transfer Logic - 2.5% Tax)
ipcMain.on('initiate-transfer', async (event, data) => {
    try {
        const amount = parseFloat(data.amount);
        let engine = data.asset === "AURA" ? AuraEngine : JewelEngine;
        
        // تطبيق ضريبة الـ 2.5% السيادية
        const result = engine.processTransaction(amount);
        
        const txRecord = {
            id: EGO-${crypto.randomBytes(3).toString('hex').toUpperCase()},
            asset: data.asset,
            original: amount,
            tax: result.tax,
            net: result.net,
            time: Date.now()
        };

        // تحديث عدادات الندرة (Scarcity Metrics)
        const metrics = {
            circulatingAura: AuraEngine.vaultBalance,
            vaultUSDT: (AuraEngine.vaultBalance * ASSET_PRICES.AURA).toFixed(2)
        };

        event.reply('transfer-complete', txRecord);
        event.reply('update-scarcity-metrics', metrics);

        // مزامنة مشفرة مع السحابة
        await sync(txRecord);

    } catch (err) {
        console.error("Transfer Error:", err);
    }
});

app.whenReady().then(createWindow);
