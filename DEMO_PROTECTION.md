# Demo Protection Guide

This document outlines the protection measures implemented to prevent abuse and control costs for your public todo app demo.

## Protection Measures Implemented

### 1. Rate Limiting

- **10 requests per minute per IP address**
- Blocks excessive API calls that could cause costs to spike
- Returns HTTP 429 status when limit exceeded

#### Adjust Rate Limits

Edit `src/app/api/todos/route.ts`:

```typescript
const maxRequests = 5; // Reduce to 5 requests per minute
const windowMs = 2 * 60 * 1000; // Increase window to 2 minutes
```

### 2. Content Filtering

- **Blocks inappropriate words**: spam, advertisement, casino, porn, etc.
- **Blocks URLs, emails, phone numbers** to prevent spam/promotional content
- **Character limits**: Max 500 characters per field
- **Repeated character detection**: Prevents spam like "aaaaaaaa"

#### Add More Blocked Words

Edit `src/lib/middleware.ts`:

```typescript
const BLOCKED_WORDS = ['spam', 'advertisement', 'casino', 'your-custom-word'];
```

### 3. Input Validation

- Type checking for all fields
- Required field validation
- Sanitization of user input

### 4. Database Limits

- **Automatic cleanup of old todos** (7 days)
- **Maximum 100 todos total** (removes oldest when exceeded)
- **Limited response size** (max 100 todos per request)

## Railway Deployment Setup

### Environment Variables

Add these to your Railway environment:

```bash
# Optional: Custom admin secret for cleanup endpoint
ADMIN_SECRET=your-secure-secret-here

# Database URL (usually auto-configured by Railway)
DB_URL=your-database-url
```

### Automated Cleanup (Recommended)

Set up a scheduled job in Railway to run cleanup:

1. **Create a new service** in Railway for the cleanup job
2. **Set the schedule**: `0 2 * * *` (daily at 2 AM)
3. **Command**: `npm run cleanup`

Example cron schedule:

```bash
# Run cleanup daily at 2 AM UTC
0 2 * * * curl -X POST https://your-app.railway.app/api/admin/cleanup \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-admin-secret"}'
```

### Change Cleanup Settings

Edit `src/lib/cleanup.ts`:

```typescript
private static readonly MAX_TODOS = 500; // Reduce max todos
private static readonly DAYS_TO_KEEP = 3; // Reduce retention
```

## Monitoring

```bash
# Check cleanup stats (public endpoint)
curl https://your-app.railway.app/api/admin/cleanup
```
