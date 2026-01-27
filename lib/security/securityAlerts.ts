/**
 * Security Alerts System
 * Manages security alerts and notifications for users
 */

export enum AlertType {
  NEW_DEVICE_LOGIN = 'new_device_login',
  PASSWORD_CHANGE = 'password_change',
  EMAIL_CHANGE = 'email_change',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  ACCOUNT_LOCKED = 'account_locked',
  MULTIPLE_FAILED_LOGINS = 'multiple_failed_logins',
  UNUSUAL_LOCATION = 'unusual_location',
  SESSION_EXPIRING = 'session_expiring',
}

export interface SecurityAlert {
  id: string;
  userId: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
  metadata?: Record<string, any>;
  actionUrl?: string;
}

class SecurityAlerts {
  private alerts: SecurityAlert[] = [];
  private maxAlerts = 100; // Keep last 100 alerts per user

  /**
   * Create a security alert
   */
  createAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'read'>): SecurityAlert {
    const securityAlert: SecurityAlert = {
      ...alert,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };

    // Add to in-memory alerts
    this.alerts.push(securityAlert);

    // Keep only last maxAlerts per user
    const userAlerts = this.alerts.filter((a) => a.userId === alert.userId);
    if (userAlerts.length > this.maxAlerts) {
      const oldestAlert = userAlerts[0];
      const index = this.alerts.indexOf(oldestAlert);
      if (index > -1) {
        this.alerts.splice(index, 1);
      }
    }

    // In production, you would:
    // 1. Store alert in database
    // 2. Send email notification
    // 3. Send push notification (if enabled)

    return securityAlert;
  }

  /**
   * Get alerts for a user
   */
  getAlertsForUser(userId: string, unreadOnly = false): SecurityAlert[] {
    let userAlerts = this.alerts.filter((alert) => alert.userId === userId);

    if (unreadOnly) {
      userAlerts = userAlerts.filter((alert) => !alert.read);
    }

    return userAlerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Mark alert as read
   */
  markAsRead(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.read = true;
    }
  }

  /**
   * Mark all alerts as read for a user
   */
  markAllAsRead(userId: string): void {
    this.alerts
      .filter((alert) => alert.userId === userId && !alert.read)
      .forEach((alert) => {
        alert.read = true;
      });
  }

  /**
   * Get unread count for a user
   */
  getUnreadCount(userId: string): number {
    return this.alerts.filter(
      (alert) => alert.userId === userId && !alert.read
    ).length;
  }

  /**
   * Clear alerts for a user
   */
  clearAlerts(userId: string): void {
    this.alerts = this.alerts.filter((alert) => alert.userId !== userId);
  }
}

// Singleton instance
export const securityAlerts = new SecurityAlerts();

/**
 * Helper functions for common security alerts
 */
export const createSecurityAlert = {
  newDeviceLogin: (userId: string, deviceInfo: string, location?: string) => {
    return securityAlerts.createAlert({
      userId,
      type: AlertType.NEW_DEVICE_LOGIN,
      title: 'New Device Login',
      message: `Your account was accessed from a new device: ${deviceInfo}${location ? ` in ${location}` : ''}. If this wasn't you, please change your password immediately.`,
      severity: 'warning',
      metadata: { deviceInfo, location },
      actionUrl: '/settings/security',
    });
  },

  passwordChange: (userId: string) => {
    return securityAlerts.createAlert({
      userId,
      type: AlertType.PASSWORD_CHANGE,
      title: 'Password Changed',
      message: 'Your password was successfully changed. If you did not make this change, please contact support immediately.',
      severity: 'info',
      actionUrl: '/settings/security',
    });
  },

  emailChange: (userId: string, oldEmail: string, newEmail: string) => {
    return securityAlerts.createAlert({
      userId,
      type: AlertType.EMAIL_CHANGE,
      title: 'Email Address Changed',
      message: `Your email address was changed from ${oldEmail} to ${newEmail}. If you did not make this change, please contact support immediately.`,
      severity: 'error',
      metadata: { oldEmail, newEmail },
      actionUrl: '/settings/security',
    });
  },

  suspiciousActivity: (userId: string, description: string) => {
    return securityAlerts.createAlert({
      userId,
      type: AlertType.SUSPICIOUS_ACTIVITY,
      title: 'Suspicious Activity Detected',
      message: description,
      severity: 'error',
      metadata: { description },
      actionUrl: '/settings/security',
    });
  },

  accountLocked: (userId: string, reason: string) => {
    return securityAlerts.createAlert({
      userId,
      type: AlertType.ACCOUNT_LOCKED,
      title: 'Account Temporarily Locked',
      message: `Your account has been temporarily locked due to: ${reason}. Please try again later or contact support.`,
      severity: 'error',
      metadata: { reason },
      actionUrl: '/support',
    });
  },

  multipleFailedLogins: (userId: string, attemptCount: number) => {
    return securityAlerts.createAlert({
      userId,
      type: AlertType.MULTIPLE_FAILED_LOGINS,
      title: 'Multiple Failed Login Attempts',
      message: `We detected ${attemptCount} failed login attempts on your account. If this wasn't you, please change your password immediately.`,
      severity: 'warning',
      metadata: { attemptCount },
      actionUrl: '/settings/change-password',
    });
  },

  sessionExpiring: (userId: string, minutesLeft: number) => {
    return securityAlerts.createAlert({
      userId,
      type: AlertType.SESSION_EXPIRING,
      title: 'Session Expiring Soon',
      message: `Your session will expire in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}. Please save your work.`,
      severity: 'info',
      metadata: { minutesLeft },
    });
  },
};
