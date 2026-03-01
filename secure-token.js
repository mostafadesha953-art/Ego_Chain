function generateActionToken(walletAddress, amount) {
    // بصمة رقمية فريدة لكل عملية تحويل
    return crypto.createHmac('sha256', SECRET_KEY)
                 .update(${walletAddress}-${amount}-${Date.now()})
                 .digest('hex').substring(0, 8);

}

// secure-token.js
let maxLimitLocked = false;

export function setMaxSupply(limit) {
    if (maxLimitLocked) throw new Error("عفواً: سقف العملة مغلق للأبد ولا يمكن تعديله.");
    
    // حفظ السقف
    this.limit = limit;
    
    // غلق الإمكانية للأبد (Finalize)
    maxLimitLocked = true; 
    return "تم تثبيت السقف بنجاح وقفل التعديل.";
}
