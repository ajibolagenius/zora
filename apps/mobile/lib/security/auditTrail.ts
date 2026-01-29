/**
 * Audit Trail System
 * Tracks user actions for compliance and security monitoring
 */

export enum AuditAction {
  // Authentication
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_SIGNUP = 'user_signup',
  PASSWORD_CHANGE = 'password_change',
  PASSWORD_RESET = 'password_reset',
  EMAIL_VERIFICATION = 'email_verification',
  EMAIL_CHANGE = 'email_change',

  // Profile
  PROFILE_UPDATE = 'profile_update',
  PROFILE_DELETE = 'profile_delete',

  // Orders
  ORDER_CREATE = 'order_create',
  ORDER_UPDATE = 'order_update',
  ORDER_CANCEL = 'order_cancel',
  ORDER_DELETE = 'order_delete',

  // Payments
  PAYMENT_CREATE = 'payment_create',
  PAYMENT_REFUND = 'payment_refund',

  // Reviews
  REVIEW_CREATE = 'review_create',
  REVIEW_UPDATE = 'review_update',
  REVIEW_DELETE = 'review_delete',

  // Settings
  SETTINGS_UPDATE = 'settings_update',
  NOTIFICATION_UPDATE = 'notification_update',

  // Security
  SECURITY_SETTING_CHANGE = 'security_setting_change',
  TWO_FACTOR_ENABLE = 'two_factor_enable',
  TWO_FACTOR_DISABLE = 'two_factor_disable',
  API_KEY_CREATE = 'api_key_create',
  API_KEY_REVOKE = 'api_key_revoke',
}

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
}

class AuditTrail {
  private logs: AuditLog[] = [];
  private maxLogs = 5000; // Keep last 5000 logs in memory

  /**
   * Create an audit log entry
   */
  log(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const auditLog: AuditLog = {
      ...log,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add to in-memory log
    this.logs.push(auditLog);

    // Keep only last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // In production, you would send this to a database or logging service
    // Example: sendToAuditService(auditLog);
  }

  /**
   * Get audit logs for a user
   */
  getLogsForUser(userId: string, limit = 100): AuditLog[] {
    return this.logs
      .filter((log) => log.userId === userId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get audit logs by action
   */
  getLogsByAction(action: AuditAction, limit = 100): AuditLog[] {
    return this.logs
      .filter((log) => log.action === action)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get audit logs for a resource
   */
  getLogsForResource(resourceType: string, resourceId: string, limit = 100): AuditLog[] {
    return this.logs
      .filter(
        (log) => log.resourceType === resourceType && log.resourceId === resourceId
      )
      .slice(-limit)
      .reverse();
  }

  /**
   * Get recent audit logs
   */
  getRecentLogs(limit = 100): AuditLog[] {
    return this.logs.slice(-limit).reverse();
  }

  /**
   * Get failed actions
   */
  getFailedActions(limit = 100): AuditLog[] {
    return this.logs
      .filter((log) => !log.success)
      .slice(-limit)
      .reverse();
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Get all logs (for export/backup)
   */
  getAllLogs(): AuditLog[] {
    return [...this.logs];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const auditTrail = new AuditTrail();

/**
 * Helper function to create audit log
 */
export function createAuditLog(
  userId: string,
  action: AuditAction,
  options: {
    resourceType?: string;
    resourceId?: string;
    success?: boolean;
    errorMessage?: string;
    metadata?: Record<string, any>;
  } = {}
): void {
  auditTrail.log({
    userId,
    action,
    resourceType: options.resourceType,
    resourceId: options.resourceId,
    success: options.success ?? true,
    errorMessage: options.errorMessage,
    metadata: options.metadata,
  });
}
