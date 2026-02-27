function generateActionToken(walletAddress, amount) {
    // بصمة رقمية فريدة لكل عملية تحويل
    return crypto.createHmac('sha256', SECRET_KEY)
                 .update(${walletAddress}-${amount}-${Date.now()})
                 .digest('hex').substring(0, 8);
}