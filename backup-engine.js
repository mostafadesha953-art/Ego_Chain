// src/backup-engine.js
const fs = require('fs');
const axios = require('axios'); // npm install axios

class BackupEngine {
    constructor(repoUrl) {
        this.repoUrl = repoUrl; // رابط ملف الـ JSON على GitHub Raw
        this.localPath = './database/chain.json';
    }

    // 1. النسخ الاحتياطي السحابي (يتم استدعاؤه تلقائياً بعد كل عملية)
    async syncToCloud(data) {
        console.log("Cloud Backup: Syncing new block to GitHub...");
        // كود الـ Octokit/Rest الذي برمجناه سابقاً في sync.js
    }

    // 2. الاستعادة الذاتية عند فقدان البيانات (Self-Healing)
    async restoreIfMissing() {
        if (!fs.existsSync(this.localPath) || fs.readFileSync(this.localPath).length === 0) {
            console.warn("CRITICAL: Local database missing! Fetching from Cloud...");
            try {
                const response = await axios.get(this.repoUrl);
                fs.writeFileSync(this.localPath, JSON.stringify(response.data, null, 2));
                console.log("Recovery Successful: Database restored from GitHub.");
                return true;
            } catch (error) {
                console.error("Recovery Failed: Cloud unreachable.", error.message);
                return false;
            }
        }
        return true;
    }
}

module.exports = BackupEngine;