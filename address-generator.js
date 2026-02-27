const crypto = require('crypto');

class EgoWalletGenerator {
    static createNewWallet() {
        // إنشاء زوج مفاتيح فريد لكل مستخدم
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
        });

        // توليد عنوان المحفظة بناءً على الـ Public Key (بصمة SHA-256)
        const hash = crypto.createHash('sha256').update(publicKey.export({type:'spki', format:'pem'})).digest('hex');
        const walletAddress = EGO_${hash.substring(0, 32)}; // عنوان الشبكة المستقل

        return {
            address: walletAddress,
            privateKey: privateKey.export({type:'pkcs8', format:'pem'}),
            publicKey: publicKey.export({type:'spki', format:'pem'})
        };
    }
}