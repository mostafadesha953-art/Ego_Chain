// netlify/functions/process-payment.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const { paymentType, currency, amount } = JSON.parse(event.body);

  try {
    if (paymentType === 'stripe') {
      // إنشاء جلسة دفع لدولار
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'EGO Chain Smart Contract' },
            unit_amount: 50, // 0.5 دولار بالسنت
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://your-site.com',
        cancel_url: 'https://your-site.com',
      });
      return { statusCode: 200, body: JSON.stringify({ id: session.id }) };
    } 
    
    else if (paymentType === 'fawry') {
      // هنا يتم توليد رقم مرجعي لفوري (Reference Number) بالجنيه المصري
      // يتم الربط مع API فوري باستخدام الـ Merchant ID الخاص بك
      const fawryRef = "EGO-" + Math.random().toString(36).substr(2, 9);
      return { 
        statusCode: 200, 
        body: JSON.stringify({ refNumber: fawryRef, message: "توجه لأقرب فرع فوري واستخدم الكود المرجعي" }) 
      };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
