console.log('🚀 SCRIPT STARTING - server-simple.js loaded');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());

import express from 'express';
console.log('✅ Express loaded successfully');

const app = express();
console.log('✅ Express app created');
const PORT = process.env.PORT || 8080;

console.log('🔄 Starting simple Express server...');
console.log('Railway plan tier:', process.env.RAILWAY_ENVIRONMENT_NAME);
console.log('Railway project:', process.env.RAILWAY_PROJECT_NAME);
console.log('Railway service:', process.env.RAILWAY_SERVICE_NAME);

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
  res.status(200).json({ status: 'healthy', port: PORT });
});

// Railway might check these endpoints
app.get('/healthz', (req, res) => {
  console.log('GET /healthz request received');
  res.status(200).send('OK');
});

app.get('/ready', (req, res) => {
  console.log('GET /ready request received');
  res.status(200).send('READY');
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

// Crash handlers
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err);
  process.exit(1);
});
