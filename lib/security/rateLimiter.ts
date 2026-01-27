/**
 * Rate Limiter Utility
 * Client-side throttling to prevent brute force attacks
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
  keyPrefix: string;
}

interface AttemptRecord {
  count: number;
  resetAt: number; // Timestamp when counter resets
  lockedUntil?: number; // Timestamp when lock expires
}

class RateLimiter {
  private storage: Map<string, AttemptRecord> = new Map();

  /**
   * Check if an action is allowed based on rate limit
   * @param key - Unique identifier for the rate limit (e.g., email, IP)
   * @param config - Rate limit configuration
   * @returns Object with allowed status and remaining attempts
   */
  checkLimit(key: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    locked: boolean;
  } {
    const storageKey = `${config.keyPrefix}:${key}`;
    const now = Date.now();
    let record = this.storage.get(storageKey);

    // Initialize record if it doesn't exist
    if (!record) {
      record = {
        count: 0,
        resetAt: now + config.windowMs,
      };
      this.storage.set(storageKey, record);
    }

    // Check if locked
    if (record.lockedUntil && now < record.lockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.lockedUntil,
        locked: true,
      };
    }

    // Reset counter if window expired
    if (now >= record.resetAt) {
      record.count = 0;
      record.resetAt = now + config.windowMs;
      record.lockedUntil = undefined;
    }

    // Check if limit exceeded
    const allowed = record.count < config.maxAttempts;
    const remaining = Math.max(0, config.maxAttempts - record.count);

    return {
      allowed,
      remaining,
      resetAt: record.resetAt,
      locked: false,
    };
  }

  /**
   * Record an attempt
   * @param key - Unique identifier
   * @param config - Rate limit configuration
   * @param lockDurationMs - Optional lock duration after max attempts
   */
  recordAttempt(key: string, config: RateLimitConfig, lockDurationMs?: number): void {
    const storageKey = `${config.keyPrefix}:${key}`;
    const now = Date.now();
    let record = this.storage.get(storageKey);

    if (!record) {
      record = {
        count: 0,
        resetAt: now + config.windowMs,
      };
    }

    // Reset if window expired
    if (now >= record.resetAt) {
      record.count = 0;
      record.resetAt = now + config.windowMs;
      record.lockedUntil = undefined;
    }

    record.count++;

    // Lock if max attempts exceeded
    if (record.count >= config.maxAttempts && lockDurationMs) {
      record.lockedUntil = now + lockDurationMs;
    }

    this.storage.set(storageKey, record);
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string, config: RateLimitConfig): void {
    const storageKey = `${config.keyPrefix}:${key}`;
    this.storage.delete(storageKey);
  }

  /**
   * Clear all rate limits
   */
  clear(): void {
    this.storage.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Predefined configurations
export const RateLimitConfigs = {
  // Login attempts: 5 attempts per 15 minutes
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyPrefix: 'rate_limit:login',
  },
  // Password reset: 3 attempts per hour
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'rate_limit:password_reset',
  },
  // Sign up: 3 attempts per hour
  signUp: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'rate_limit:signup',
  },
  // OAuth: 10 attempts per hour
  oauth: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: 'rate_limit:oauth',
  },
} as const;

/**
 * Helper to check and record login attempts
 */
export function checkLoginRateLimit(email: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  locked: boolean;
  errorMessage?: string;
} {
  const config = RateLimitConfigs.login;
  const check = rateLimiter.checkLimit(email.toLowerCase(), config);

  if (!check.allowed) {
    if (check.locked) {
      const minutesLeft = Math.ceil((check.resetAt - Date.now()) / (60 * 1000));
      return {
        ...check,
        errorMessage: `Too many login attempts. Please try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`,
      };
    }
    return {
      ...check,
      errorMessage: `Too many login attempts. Please try again later.`,
    };
  }

  return check;
}

/**
 * Record a login attempt
 */
export function recordLoginAttempt(email: string, lockDurationMs = 30 * 60 * 1000): void {
  const config = RateLimitConfigs.login;
  rateLimiter.recordAttempt(email.toLowerCase(), config, lockDurationMs);
}

/**
 * Reset login rate limit (e.g., after successful login)
 */
export function resetLoginRateLimit(email: string): void {
  const config = RateLimitConfigs.login;
  rateLimiter.reset(email.toLowerCase(), config);
}
