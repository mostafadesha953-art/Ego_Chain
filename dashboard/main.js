const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const crypto = require('crypto');
const SecurityVault = require('../src/security-vault');
const sync = require('../src/sync');
const { AuraEngine, JewelEngine } = require('../src/tokenomics-engine');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1250, height: 900,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
        title: "EgoChain Core - 21M Sovereign Edition",
        backgroundColor: '#0a0b0d'
    });
    mainWindow.loadFile('index.html');
}

ipcMain.on('initiate-transfer', async (event, data) => {
    try {
        const amount = parseFloat(data.amount);
        let engine = data.asset === "AURA" ? AuraEngine : JewelEngine;
        
        // معالجة الضريبة 2.5% وتحديث المحرك
        const result = engine.processTransaction(amount);
        
        const txRecord = {
            id: EGO-${crypto.randomBytes(3).toString('hex').toUpperCase()},
            asset: data.asset,
            original: amount,
            tax: result.tax,
            net: result.net,
            time: Date.now()
        };

        // تحديث الواجهة بعدادات الندرة
        const metrics = {
            circulatingAura: AuraEngine.vaultBalance, // ما تم سحبه للخزينة
            vaultUSDT: (AuraEngine.vaultBalance * 0.1).toFixed(2) // افتراض قيمة ربحية
        };

        event.reply('transfer-complete', txRecord);
        event.reply('update-scarcity-metrics', metrics);

        // المزامنة المشفرة مع GitHub
        await sync(txRecord);

    } catch (err) {
        console.error(err);
    }
});

app.whenReady().then(createWindow);
