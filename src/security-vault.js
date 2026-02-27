const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.SECURITY_KEY || 'EGO_ULTIMATE_SECRET_123456789012'; // مفتاح 32 بت
const IV = crypto.randomBytes(16);

class SecurityVault {
    static encrypt(text) {
        let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), IV);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: IV.toString('hex'), data: encrypted.toString('hex') };
    }

    static decrypt(iv, data) {
        let ivBuffer = Buffer.from(iv, 'hex');
        let encryptedText = Buffer.from(data, 'hex');
        let decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), ivBuffer);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
module.exports = SecurityVault;