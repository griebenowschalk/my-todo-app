# Environment Variables

## Required Variables

### `NODE_ENV`

- **Development:** `development`
- **Production:** `production`
- **Railway:** Automatically set to `production`

### `PORT`

- **Default:** `3000`
- **Railway:** Automatically set by Railway

## Railway-Specific

### `RAILWAY_ENVIRONMENT`

- **Railway sets this automatically** to `production`
- **Used by our server** to allow unsafe scripts in Railway deployment

## How It Works

The server detects the environment and adjusts Content Security Policy:

```typescript
const isDev = process.env.NODE_ENV !== 'production';
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';
const allowUnsafeScripts = isDev || isRailway;
```

- **Local Development:** Allows unsafe scripts for Next.js hot reloading
- **Railway Production:** Allows unsafe scripts because Next.js needs them
- **Strict Production:** Only allows same-origin scripts (if not Railway)

## Deployment

Railway automatically sets:

- `NODE_ENV=production`
- `RAILWAY_ENVIRONMENT=production`
- `PORT` (assigned by Railway)
