import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🔄 Starting simple Express server...');

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Simple server working',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

console.log(`🔄 Starting server on port ${PORT}...`);
app
  .listen(PORT, () => {
    console.log(`🚀 Simple server running on port ${PORT}`);
  })
  .on('error', (err) => {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  });

console.log('✅ Server setup complete');
