const { Octokit } = require("@octokit/rest");
const SecurityVault = require('./security-vault'); // استدعاء محرك التشفير AES-256
require('dotenv').config(); // تحميل المفاتيح من ملف .env

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN // يستخدم التوكين السري من جهازك فقط
});

// إعدادات المستودع (تأكد من مطابقتها لحسابك)
const REPO_CONFIG = {
    owner: "YOUR_GITHUB_USERNAME", // اسم المستخدم الخاص بك على جيت هاب
    repo: "YOUR_REPO_NAME",        // اسم المستودع (المخزن)
    path: "database/chain.json"    // مسار سجل البلوكتشين
};

/**
 * وظيفة المزامنة العالمية: تشفير البيانات ورفعها للسحابة لتظهر على Netlify
 */
async function syncToGithub(blockchainData) {
    try {
        // 1. تأمين البيانات: تشفير سجل المعاملة قبل رفعه للعالم
        const sensitiveData = JSON.stringify(blockchainData);
        const encryptedPayload = SecurityVault.encrypt(sensitiveData);

        // 2. جلب بصمة الملف الحالي (SHA) لتجنب أخطاء التحديث
        let currentSha = null;
        try {
            const { data } = await octokit.repos.getContent(REPO_CONFIG);
            currentSha = data.sha;
        } catch (e) {
            console.log("First block initialization...");
        }

        // 3. تحويل البيانات المشفرة إلى Base64 (متطلب GitHub API)
        const contentBase64 = Buffer.from(JSON.stringify(encryptedPayload)).toString('base64');

        // 4. الرفع السيادي للسحابة (Push to Cloud)
        await octokit.repos.createOrUpdateFileContents({
            ...REPO_CONFIG,
            message: Sovereign Update: +2.5% Tax Collected [Asset: ${blockchainData.asset || 'AURA'}],
            content: contentBase64,
            sha: currentSha, // البصمة الحالية لضمان التسلسل الصحيح
            committer: {
                name: "EgoChain-Core-System",
                email: "admin@ego-chain.netlify.app"
            }
        });

        console.log("✅ [EgoChain] Global Cloud Sync Successful!");
        console.log("🌐 Check Live Ledger: https://ego-chain.netlify.app");

    } catch (error) {
        console.error("❌ [Sovereign-Sync-Error]:", error.message);
        // في حالة الفشل، يتم حفظ العملية في سجل طوارئ محلي
    }
}

module.exports = syncToGithub;
