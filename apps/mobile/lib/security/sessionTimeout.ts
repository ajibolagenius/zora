/**
 * Session Timeout Management
 * Handles session expiry warnings and automatic timeout
 */

export interface SessionTimeoutConfig {
  warningTimeMs: number; // Show warning this many ms before expiry
  sessionDurationMs: number; // Total session duration
  autoRefresh: boolean; // Automatically refresh session
}

const DEFAULT_CONFIG: SessionTimeoutConfig = {
  warningTimeMs: 5 * 60 * 1000, // 5 minutes before expiry
  sessionDurationMs: 24 * 60 * 60 * 1000, // 24 hours
  autoRefresh: true,
};

class SessionTimeoutManager {
  private config: SessionTimeoutConfig = DEFAULT_CONFIG;
  private warningCallback?: (minutesLeft: number) => void;
  private expiryCallback?: () => void;
  private warningTimer?: NodeJS.Timeout;
  private expiryTimer?: NodeJS.Timeout;
  private sessionStartTime?: number;

  /**
   * Configure session timeout
   */
  configure(config: Partial<SessionTimeoutConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Start session timeout tracking
   */
  startSession(
    onWarning?: (minutesLeft: number) => void,
    onExpiry?: () => void
  ): void {
    this.warningCallback = onWarning;
    this.expiryCallback = onExpiry;
    this.sessionStartTime = Date.now();

    // Clear existing timers
    this.clearTimers();

    const warningTime = this.config.sessionDurationMs - this.config.warningTimeMs;

    // Set warning timer
    if (warningTime > 0) {
      this.warningTimer = setTimeout(() => {
        const minutesLeft = Math.ceil(this.config.warningTimeMs / (60 * 1000));
        if (this.warningCallback) {
          this.warningCallback(minutesLeft);
        }
      }, warningTime);
    }

    // Set expiry timer
    this.expiryTimer = setTimeout(() => {
      if (this.expiryCallback) {
        this.expiryCallback();
      }
      this.clearTimers();
    }, this.config.sessionDurationMs);
  }

  /**
   * Refresh session (reset timers)
   */
  refreshSession(): void {
    if (this.config.autoRefresh) {
      this.startSession(this.warningCallback, this.expiryCallback);
    }
  }

  /**
   * Get time remaining until expiry
   */
  getTimeRemaining(): number {
    if (!this.sessionStartTime) return 0;
    const elapsed = Date.now() - this.sessionStartTime;
    return Math.max(0, this.config.sessionDurationMs - elapsed);
  }

  /**
   * Get minutes remaining until expiry
   */
  getMinutesRemaining(): number {
    return Math.ceil(this.getTimeRemaining() / (60 * 1000));
  }

  /**
   * Check if session is expiring soon
   */
  isExpiringSoon(): boolean {
    const remaining = this.getTimeRemaining();
    return remaining > 0 && remaining <= this.config.warningTimeMs;
  }

  /**
   * Clear all timers
   */
  clearTimers(): void {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = undefined;
    }
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = undefined;
    }
  }

  /**
   * End session
   */
  endSession(): void {
    this.clearTimers();
    this.sessionStartTime = undefined;
    this.warningCallback = undefined;
    this.expiryCallback = undefined;
  }
}

// Singleton instance
export const sessionTimeoutManager = new SessionTimeoutManager();
