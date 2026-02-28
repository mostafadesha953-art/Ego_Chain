const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// تأكد من وجود هذه الملفات في مساراتها الصحيحة أو قم بتعطيل الاستدعاء مؤقتاً للتجربة
const SecurityVault = require('../src/security-vault');
const sync = require('../src/sync');
const { AuraEngine, JewelEngine } = require('../src/tokenomics-engine');

let mainWindow;

const ASSET_PRICES = {
    AURA: 0.63,
    JEWEL: 0.45
};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1250, 
        height: 900,
        webPreferences: { 
            nodeIntegration: true, 
            contextIsolation: false,
            enableRemoteModule: true 
        },
        title: "EgoChain Core - 21M Sovereign Edition",
        backgroundColor: '#0a0b0d'
    });
    
    // تأكد من أن ملف index.html في نفس مجلد dashboard مع main.js
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// 1. محرك معالجة الشراء (تم إصلاح خطأ الـ Template Literal)
ipcMain.on('initiate-buy', async (event, purchaseData) => {
    try {
        const { asset, amount, cost } = purchaseData;
        const usersPath = path.join(__dirname, '../database/users.json');
        
        if (!fs.existsSync(usersPath)) {
            return console.error("Missing users.json database");
        }

        let users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        let user = users[0]; 

        if (user.balances.USDT < cost) {
            return event.reply('transfer-error', "عذراً، رصيد USDT غير كافٍ.");
        }

        user.balances.USDT -= parseFloat(cost);
        user.balances[asset] += parseFloat(amount);

        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        event.reply('balance-updated', user.balances);

        const buyRecord = {
            id: BUY-${crypto.randomBytes(2).toString('hex').toUpperCase()}, // تم إصلاح علامات الاقتباس
            type: "ASSET_PURCHASE",
            asset, amount, cost, time: Date.now()
        };
        
        await sync(buyRecord);

    } catch (err) {
        console.error("Buy Error:", err);
    }
});

// 2. محرك معالجة التحويل (تم إصلاح خطأ الـ Template Literal)
ipcMain.on('initiate-transfer', async (event, data) => {
    try {
        const amount = parseFloat(data.amount);
        let engine = data.asset === "AURA" ? AuraEngine : JewelEngine;
        
        const result = engine.processTransaction(amount);
        
        const txRecord = {
            id: EGO-${crypto.randomBytes(3).toString('hex').toUpperCase()}, // تم إصلاح علامات الاقتباس
            asset: data.asset,
            original: amount,
            tax: result.tax,
            net: result.net,
            time: Date.now()
        };

        const metrics = {
            circulatingAura: AuraEngine.vaultBalance,
            vaultUSDT: (AuraEngine.vaultBalance * ASSET_PRICES.AURA).toFixed(2)
        };

        event.reply('transfer-complete', txRecord);
        event.reply('update-scarcity-metrics', metrics);

        await sync(txRecord);

    } catch (err) {
        console.error("Transfer Error:", err);
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
