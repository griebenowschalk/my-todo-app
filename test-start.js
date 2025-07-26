console.log('🚀 TEST SCRIPT STARTING');
console.log('Current time:', new Date().toISOString());
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);

setTimeout(() => {
  console.log('⏰ Test script still running after 5 seconds');
}, 5000);

setTimeout(() => {
  console.log('⏰ Test script still running after 10 seconds');
}, 10000);

console.log('✅ Test script setup complete');
