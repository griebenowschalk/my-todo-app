import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

console.log('🔄 Starting simple Express server...');

app.get('/', (req, res) => {
  console.log('GET / request received');
  res.json({
    status: 'ok',
    message: 'Simple server working',
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV,
  });
});

app.get('/health', (req, res) => {
  console.log('GET /health request received');
  res.json({ status: 'healthy', port: PORT });
});

app.get('/test', (req, res) => {
  console.log('GET /test request received');
  res.send('Test endpoint working!');
});

console.log(`🔄 Starting server on port ${PORT}...`);
console.log('PORT env var:', process.env.PORT);
console.log('Using port:', PORT);

app
  .listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Simple server running on 0.0.0.0:${PORT}`);
    console.log('Server is ready to accept connections');
  })
  .on('error', (err) => {
    console.error('❌ Server failed to start:', err);
    console.error('Error code:', err.code);
    console.error('Port attempted:', PORT);
    process.exit(1);
  });

console.log('✅ Server setup complete');
