import express, { Request, Response } from 'express';
import next from 'next';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const isDev = process.env.NODE_ENV !== 'production';
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
          scriptSrc: isDev
            ? ["'self'", "'unsafe-eval'", "'unsafe-inline'"] // Allow scripts in dev (Next.js needs this)
            : ["'self'"], // Only same-origin scripts in production
          styleSrc: isDev ? ["'self'", "'unsafe-inline'"] : ["'self'"], // Allow inline styles in dev
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
