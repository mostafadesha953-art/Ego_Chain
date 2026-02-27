const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const crypto = require('crypto');
const SecurityVault = require('../src/security-vault');
const sync = require('../src/sync');
const KillSwitch = require('../src/kill-switch');

let mainWindow;
const netGuard = new KillSwitch("رابط_ملف_status_على_github_raw");

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, height: 850,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
        title: "EgoChain Core - Sovereign Edition",
        backgroundColor: '#0a0b0d'
    });
    mainWindow.loadFile('index.html');

    // فحص دوري لحالة الشبكة (Kill Switch)
    setInterval(async () => {
        const status = await netGuard.checkNetworkStatus();
        if (status === "HALTED") mainWindow.webContents.send('network-halted');
    }, 30000);
}

ipcMain.on('initiate-transfer', async (event, data) => {
    // التأكد من أن الشبكة ليست متوقفة
    if (netGuard.isSystemHalted) return event.reply('transfer-error', "الشبكة متوقفة حالياً.");

    // حساب الرسوم 2.5% والوصول للصافي
    const tax = data.amount * 0.025;
    const net = data.amount - tax;

    const txRecord = {
        id: EGO-${crypto.randomBytes(3).toString('hex').toUpperCase()},
        ...data, tax, net, time: Date.now(), status: "SECURED"
    };

    // التشفير AES-256 قبل الرفع للسحابة
    const encryptedTx = SecurityVault.encrypt(JSON.stringify(txRecord));
    await sync.pushToCloud(encryptedTx);

    event.reply('transfer-complete', txRecord);
});

app.whenReady().then(createWindow);