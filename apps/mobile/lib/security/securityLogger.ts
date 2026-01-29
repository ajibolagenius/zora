/**
 * Security Event Logger
 * Logs security-related events for monitoring and audit purposes
 */

export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  PASSWORD_RESET_SUCCESS = 'password_reset_success',
  EMAIL_VERIFICATION_SENT = 'email_verification_sent',
  EMAIL_VERIFIED = 'email_verified',
  EMAIL_CHANGE = 'email_change',
  PROFILE_UPDATE = 'profile_update',
  SESSION_REFRESHED = 'session_refreshed',
  SESSION_EXPIRED = 'session_expired',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',
  OAUTH_SUCCESS = 'oauth_success',
  OAUTH_FAILED = 'oauth_failed',
  TWO_FACTOR_ENABLED = 'two_factor_enabled',
  TWO_FACTOR_DISABLED = 'two_factor_disabled',
  TWO_FACTOR_VERIFIED = 'two_factor_verified',
  TWO_FACTOR_FAILED = 'two_factor_failed',
}

export interface SecurityEvent {
  type: SecurityEventType;
  userId?: string;
  email?: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events in memory

  /**
   * Log a security event
   */
  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
    };

    // Add to in-memory log
    this.events.push(securityEvent);

    // Keep only last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log to console in development
    if (__DEV__) {
      console.log('[Security Event]', {
        type: securityEvent.type,
        userId: securityEvent.userId,
        email: securityEvent.email,
        severity: securityEvent.severity,
        timestamp: new Date(securityEvent.timestamp).toISOString(),
        metadata: securityEvent.metadata,
      });
    }

    // In production, you would send this to a logging service
    // Example: sendToLoggingService(securityEvent);
  }

  /**
   * Get events for a user
   */
  getEventsForUser(userId: string, limit = 50): SecurityEvent[] {
    return this.events
      .filter((event) => event.userId === userId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get events by type
   */
  getEventsByType(type: SecurityEventType, limit = 50): SecurityEvent[] {
    return this.events
      .filter((event) => event.type === type)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 50): SecurityEvent[] {
    return this.events.slice(-limit).reverse();
  }

  /**
   * Get events by severity
   */
  getEventsBySeverity(severity: SecurityEvent['severity'], limit = 50): SecurityEvent[] {
    return this.events
      .filter((event) => event.severity === severity)
      .slice(-limit)
      .reverse();
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Get all events (for export/backup)
   */
  getAllEvents(): SecurityEvent[] {
    return [...this.events];
  }
}

// Singleton instance
export const securityLogger = new SecurityLogger();

/**
 * Helper functions for common security events
 */
export const logSecurityEvent = {
  loginSuccess: (userId: string, email: string, metadata?: Record<string, any>) => {
    securityLogger.log({
      type: SecurityEventType.LOGIN_SUCCESS,
      userId,
      email,
      severity: 'low',
      metadata,
    });
  },

  loginFailed: (email: string, reason: string, metadata?: Record<string, any>) => {
    securityLogger.log({
      type: SecurityEventType.LOGIN_FAILED,
      email,
      severity: 'medium',
      metadata: { reason, ...metadata },
    });
  },

  logout: (userId: string, email: string) => {
    securityLogger.log({
      type: SecurityEventType.LOGOUT,
      userId,
      email,
      severity: 'low',
    });
  },

  passwordChange: (userId: string, email: string) => {
    securityLogger.log({
      type: SecurityEventType.PASSWORD_CHANGE,
      userId,
      email,
      severity: 'high',
    });
  },

  passwordResetRequest: (email: string) => {
    securityLogger.log({
      type: SecurityEventType.PASSWORD_RESET_REQUEST,
      email,
      severity: 'medium',
    });
  },

  passwordResetSuccess: (email: string) => {
    securityLogger.log({
      type: SecurityEventType.PASSWORD_RESET_SUCCESS,
      email,
      severity: 'high',
    });
  },

  emailVerificationSent: (userId: string, email: string) => {
    securityLogger.log({
      type: SecurityEventType.EMAIL_VERIFICATION_SENT,
      userId,
      email,
      severity: 'low',
    });
  },

  emailVerified: (userId: string, email: string) => {
    securityLogger.log({
      type: SecurityEventType.EMAIL_VERIFIED,
      userId,
      email,
      severity: 'medium',
    });
  },

  rateLimitExceeded: (email: string, action: string) => {
    securityLogger.log({
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      email,
      severity: 'medium',
      metadata: { action },
    });
  },

  suspiciousActivity: (userId: string, email: string, description: string, metadata?: Record<string, any>) => {
    securityLogger.log({
      type: SecurityEventType.SUSPICIOUS_ACTIVITY,
      userId,
      email,
      severity: 'high',
      metadata: { description, ...metadata },
    });
  },

  accountLocked: (userId: string, email: string, reason: string) => {
    securityLogger.log({
      type: SecurityEventType.ACCOUNT_LOCKED,
      userId,
      email,
      severity: 'high',
      metadata: { reason },
    });
  },

  sessionExpired: (userId: string, email: string) => {
    securityLogger.log({
      type: SecurityEventType.SESSION_EXPIRED,
      userId,
      email,
      severity: 'medium',
    });
  },
};
