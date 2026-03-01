// src/secure-token.js

export class TokenSecurity {
    constructor(initialLimit) {
        this.limit = initialLimit;
        this.maxLimitLocked = false;
    }

    // وظيفة تحديد وقفل السقف للأبد
    setMaxSupply(limit) {
        if (this.maxLimitLocked) {
            throw new Error("⚠️ اختراق أمني: سقف العملة مغلق للأبد ولا يمكن فتحه!");
        }
        
        this.limit = limit;
        this.maxLimitLocked = true; // غلق الإمكانية للأبد (Finalize)
        
        // تجميد الكائن لمنع أي تغيير عبر الـ Memory injection
        Object.freeze(this); 
        
        return ✅ تم تثبيت سقف العملة عند ${limit} وقفل التعديل نهائياً.;
    }

    // وظيفة للتحقق من الحالة
    isLocked() {
        return this.maxLimitLocked;
    }
}
