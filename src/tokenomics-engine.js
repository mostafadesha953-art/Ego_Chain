// src/tokenomics-engine.js - محرك الندرة والتعدين الذكي لشبكة EGO Chain

export class ScarcityEngine {
    constructor(maxSupply = 100000000) {
        this.MAX_SUPPLY = maxSupply;
        this.MIN_MINING_SPEED = 0.0000005; // الحد الأدنى للسرعة عند 95%
        this.isLocked = false;
    }

    /**
     * حساب سرعة الهاش بناءً على نسبة التعدين الإجمالية
     * القاعدة: تقل السرعة كلما زاد التعدين بنسبة 5%
     */
    calculateCurrentHashRate(currentMined) {
        let percentage = (currentMined / this.MAX_SUPPLY) * 100;
        
        // 1. الوصول للحد الأدنى المطلق عند 95% كما طلبت
        if (percentage >= 95) {
            return this.MIN_MINING_SPEED; 
        }

        // 2. منطق التضيق التدريجي: تقليل السرعة كلما زاد التعدين 5%
        let baseRate = 1.0; // السرعة الافتراضية
        let steps = Math.floor(percentage / 5);
        
        // السرعة تقل بنسبة 20% (0.😎 عند كل خطوة (Step) 5%
        let currentRate = baseRate * Math.pow(0.8, steps); 

        return currentRate;
    }

    /**
     * قفل سقف العملة للأبد ومنع أي تعديل عليه
     */
    lockSupply() {
        if (this.isLocked) return "تنبيه: السقف مقفل بالفعل.";
        
        this.isLocked = true;
        // قفل الكائن برمجياً لمنع التلاعب بالقيم في الذاكرة
        Object.freeze(this); 
        
        console.warn("🔒 EGO Chain: تم تفعيل قفل السقف النهائي. لا يمكن إصدار عملات إضافية.");
        return true;
    }
}
