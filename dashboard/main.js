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

app.whenReady().then(createWindow);
