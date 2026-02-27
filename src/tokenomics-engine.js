class TokenomicsEngine {
    constructor(symbol, maxSupply) {
        this.symbol = symbol;
        this.maxSupply = maxSupply;
        this.circulatingSupply = 0;
        this.vaultBalance = 0;
    }

    // بدلاً من الحرق، الرسوم 2.5% تذهب للخزينة لرفع القيمة
    collectTax(amount) {
        const tax = amount * 0.025;
        this.vaultBalance += tax;
        this.circulatingSupply -= tax; // تضييق السيولة السوقية
        return tax;
    }
}
module.exports = { 
    Aura: new TokenomicsEngine("AURA", 21000000), 
    Jewel: new TokenomicsEngine("JEWEL", 21000000) 

};
