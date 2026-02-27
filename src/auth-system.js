const fs = require('fs');
const crypto = require('crypto');

class AuthSystem {
    constructor() { this.dbPath = './database/users.json'; }
    verifyKYC(nationalID, name) {
        // تشفير الهوية قبل التخزين للامتثال للقانون المصري
        return crypto.createHash('sha256').update(nationalID + name).digest('hex');
    }
}
module.exports = new AuthSystem();