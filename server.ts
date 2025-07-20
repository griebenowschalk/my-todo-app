import express, { Request, Response } from 'express';
import next from 'next';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Environment detection - Railway sets NODE_ENV=production
const isDev = process.env.NODE_ENV !== 'production';
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';
const isRailwayDeploy =
  process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID; // Check for any Railway env var
const allowUnsafeScripts = isDev || isRailway || isRailwayDeploy; // Allow unsafe scripts in dev OR Railway

// Debug logging
console.log('Environment Debug:', {
  NODE_ENV: process.env.NODE_ENV,
  RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
  RAILWAY_PROJECT_ID: process.env.RAILWAY_PROJECT_ID,
  isDev,
  isRailway,
  isRailwayDeploy,
  allowUnsafeScripts,
});

const app = next({ dev: isDev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Helmet - Security Headers
  server.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], // Only allow resources from same origin
          scriptSrc: allowUnsafeScripts
            ? ["'self'", "'unsafe-eval'", "'unsafe-inline'"] // Allow scripts in dev/Railway (Next.js needs this)
            : ["'self'"], // Only same-origin scripts in strict production
          styleSrc: allowUnsafeScripts
            ? ["'self'", "'unsafe-inline'"]
            : ["'self'"], // Allow inline styles in dev/Railway
          imgSrc: ["'self'", 'data:', 'https:'], // Allow images from same origin, data URLs, and HTTPS
          connectSrc: ["'self'"], // Allow API calls to same origin
          fontSrc: ["'self'"], // Allow fonts from same origin
          objectSrc: ["'none'"], // Block objects (Flash, Java, etc.)
          mediaSrc: ["'self'"], // Allow media from same origin
          frameSrc: ["'none'"], // Block iframes (prevents clickjacking)
        },
      },
      // Additional security headers
      hsts: {
        maxAge: 31536000, // Force HTTPS for 1 year
        includeSubDomains: true, // Apply to all subdomains
        preload: true, // Include in browser HSTS preload list
      },
      noSniff: true, // Prevent MIME type sniffing
      xssFilter: true, // Enable XSS protection
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Control referrer information
    })
  );

  // CORS - Cross-Origin Resource Sharing
  server.use(cors());

  // Morgan - Request Logging
  server.use(morgan('combined'));

  // Body Parsing - Parse JSON and URL-encoded bodies
  server.use(express.json()); // Parse JSON bodies
  server.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

  // Let Next.js handle all other routes
  server.use((req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`🚀 Node.js server running on http://localhost:${PORT}`);
  });
});
