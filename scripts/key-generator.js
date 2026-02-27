const crypto = require('crypto');
const fs = require('fs');

function generateIdentity() {
    // Generate a pair of keys: Public and Private
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // Save them locally (Keep Private Key secret!)
    fs.writeFileSync('private_key.pem', privateKey);
    fs.writeFileSync('public_key.pem', publicKey);

    console.log("Keys generated! Your Public Key is your Wallet Address.");
    return { publicKey, privateKey };
}

generateIdentity();