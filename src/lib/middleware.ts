import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

export const BLOCKED_WORDS = [
  'spam',
  'advertisement',
  'casino',
  'porn',
  'sex',
  'drug',
  'viagra',
  'crypto',
  'bitcoin',
  'investment',
  'money',
  'rich',
  'millionaire',
  'scam',
  'hack',
];

const BLOCKED_PATTERNS = [
  /https?:\/\/[^\s]+/gi, // URLs
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, // Email addresses
  /\b\d{10,}\b/g, // Phone numbers (10+ digits)
  /(.)\1{4,}/gi, // Repeated characters (aaaaa, 11111)
];

// Rate limiting - max 10 requests per minute per IP
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slow down aggressive users - delays responses
export const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1 minute
  delayAfter: 5, // Start slowing down after 5 requests
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 5000, // Maximum delay of 5 seconds
});

export function contentFilter(text: string): {
  isValid: boolean;
  reason?: string;
} {
  if (!text || typeof text !== 'string') {
    return { isValid: false, reason: 'Invalid text' };
  }

  if (text.length > 500) {
    return { isValid: false, reason: 'Text too long (max 500 characters)' };
  }

  const lowerText = text.toLowerCase();
  for (const word of BLOCKED_WORDS) {
    if (lowerText.includes(word)) {
      return { isValid: false, reason: 'Contains inappropriate content' };
    }
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        reason: 'Contains blocked content (URLs, emails, etc.)',
      };
    }
  }

  return { isValid: true };
}

export function validateTodoInput(data: unknown): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format');
    return { isValid: false, errors };
  }

  const todoData = data as Record<string, unknown>;

  if (!todoData.title || typeof todoData.title !== 'string') {
    errors.push('Title is required and must be a string');
  } else {
    const titleCheck = contentFilter(todoData.title);
    if (!titleCheck.isValid) {
      errors.push(`Title: ${titleCheck.reason}`);
    }
  }

  if (todoData.description && typeof todoData.description === 'string') {
    const descCheck = contentFilter(todoData.description);
    if (!descCheck.isValid) {
      errors.push(`Description: ${descCheck.reason}`);
    }
  }

  if (
    todoData.completed !== undefined &&
    typeof todoData.completed !== 'boolean'
  ) {
    errors.push('Completed must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

export function createRateLimitResponse() {
  return Response.json(
    { error: 'Too many requests, please try again later.' },
    { status: 429 }
  );
}
