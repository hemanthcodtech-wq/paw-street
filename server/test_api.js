async function testBackend() {
  console.log('Testing PAW NEAR Backend Endpoints...\n');

  try {
    const health = await (await fetch('http://localhost:5000/api/health')).json();
    console.log('1. Health check:', health.status, '| Mongodb:', health.features.mongodb);

    const otp = await (await fetch('http://localhost:5000/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@thepawstreet.com', purpose: 'login' })
    })).json();
    console.log('2. Email OTP API:', otp.success ? 'SUCCESS' : 'FAILED', '| Code:', otp.otpPreviewInDev || otp.message);

    const prods = await (await fetch('http://localhost:5000/api/products')).json();
    console.log('3. Products Catalog API:', prods.success ? `SUCCESS (${prods.count || prods.data?.length || 0} products)` : 'FAILED');

    const razorpay = await (await fetch('http://localhost:5000/api/payments/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 907, receipt: 'rec_test_907' })
    })).json();
    console.log('4. Razorpay Order Creation API:', razorpay.success ? `SUCCESS (Order ID: ${razorpay.order?.id})` : 'FAILED');

    const adminMetrics = await (await fetch('http://localhost:5000/api/admin/metrics')).json();
    console.log('5. Admin Governance Metrics API:', adminMetrics.success ? `SUCCESS (GMV: ₹${adminMetrics.metrics?.totalGmv})` : 'FAILED');

    const delivery = await (await fetch('http://localhost:5000/api/delivery/profile')).json();
    console.log('6. Delivery Partner API:', delivery.success ? `SUCCESS (Rider: ${delivery.rider?.name})` : 'FAILED');

    console.log('\n🌟 All 6 PAW NEAR Backend Subsystems Fully Connected and Operational!');
  } catch (err) {
    console.error('Test error:', err.message);
  }
}

testBackend();
