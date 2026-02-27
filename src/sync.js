const { Octokit } = require("@octokit/rest");
const SecurityVault = require('./security-vault'); // محرك التشفير AES-256
require('dotenv').config(); 

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN 
});

// إعدادات المستودع الخاصة بك
const REPO_CONFIG = {
    owner: "YOUR_GITHUB_USERNAME", 
    repo: "YOUR_REPO_NAME",        
    path: "database/chain.json"    
};

/**
 * وظيفة المزامنة العالمية المدمجة: تشفير + مزامنة SHA + تحديث Netlify
 */
async function syncToGithub(blockchainData) {
    try {
        // 1. تأمين البيانات: تشفير سجل المعاملة (الضريبة 2.5%) قبل الرفع
        const sensitiveData = JSON.stringify(blockchainData);
        const encryptedPayload = SecurityVault.encrypt(sensitiveData);

        // 2. معالجة الـ SHA (لضمان تحديث الملف دون أخطاء 409)
        let currentSha = null;
        try {
            const { data } = await octokit.repos.getContent(REPO_CONFIG);
            currentSha = data.sha;
        } catch (e) {
            console.log("إعداد الكتلة الأولى في السحابة...");
        }

        // 3. تحويل البيانات المشفرة إلى Base64
        const contentBase64 = Buffer.from(JSON.stringify(encryptedPayload)).toString('base64');

        // 4. الرفع السيادي المحدث (Push to Cloud)
        await octokit.repos.createOrUpdateFileContents({
            ...REPO_CONFIG,
            message: Sovereign Update: +2.5% Tax Collected [Asset: ${blockchainData.asset || 'AURA'}],
            content: contentBase64,
            sha: currentSha, 
            committer: {
                name: "EgoChain-Core-System",
                email: "admin@ego-chain.netlify.app"
            }
        });

        console.log("✅ [EgoChain] تمت المزامنة السحابية بنجاح!");
        console.log("🌐 الرابط الحي: https://ego-chain.netlify.app");

    } catch (error) {
        console.error("❌ [Sovereign-Sync-Error]:", error.message);
    }
}

module.exports = syncToGithub;
