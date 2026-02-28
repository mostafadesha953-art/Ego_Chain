const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1250, height: 900,
        webPreferences: {
            nodeIntegration: true,     // تفعيل الربط مع الأزرار
            contextIsolation: false,    // السماح للأوامر بالمرور
            enableRemoteModule: true
        },
        title: "EgoChain Core - 21M Edition"
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// محرك معالجة الشراء (إصلاح الربط)
ipcMain.on('initiate-buy', (event, data) => {
    console.log("📥 استلام طلب شراء:", data);
    // تنفيذ منطق الشراء هنا
    event.reply('balance-updated', { AURA: 1000, JEWEL: 5000, USDT: 50 }); // رد سريع للتأكيد
});

// محرك معالجة التحويل (إصلاح الربط)
ipcMain.on('initiate-transfer', (event, data) => {
    console.log("📥 استلام طلب تحويل:", data);
    event.reply('transfer-complete', { id: "EGO-123", ...data });
});

app.on('ready', createWindow);
    }
});

app.whenReady().then(createWindow);

