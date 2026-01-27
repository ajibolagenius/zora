/**
 * Account Recovery Utilities
 * Handles account lockout and recovery options
 */

export interface AccountLockoutConfig {
  maxFailedAttempts: number;
  lockoutDurationMs: number;
  resetAfterSuccess: boolean;
}

const DEFAULT_LOCKOUT_CONFIG: AccountLockoutConfig = {
  maxFailedAttempts: 5,
  lockoutDurationMs: 30 * 60 * 1000, // 30 minutes
  resetAfterSuccess: true,
};

class AccountRecoveryManager {
  private lockouts: Map<string, { lockedUntil: number; attemptCount: number }> = new Map();
  private config: AccountLockoutConfig = DEFAULT_LOCKOUT_CONFIG;

  /**
   * Configure lockout settings
   */
  configure(config: Partial<AccountLockoutConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Record a failed login attempt
   */
  recordFailedAttempt(identifier: string): {
    locked: boolean;
    attemptsRemaining: number;
    lockedUntil?: number;
  } {
    const now = Date.now();
    let lockout = this.lockouts.get(identifier);

    if (!lockout) {
      lockout = { lockedUntil: 0, attemptCount: 0 };
    }

    // Check if lockout expired
    if (lockout.lockedUntil > 0 && now >= lockout.lockedUntil) {
      lockout.attemptCount = 0;
      lockout.lockedUntil = 0;
    }

    // Increment attempt count
    lockout.attemptCount++;

    // Check if should lock
    if (lockout.attemptCount >= this.config.maxFailedAttempts) {
      lockout.lockedUntil = now + this.config.lockoutDurationMs;
      this.lockouts.set(identifier, lockout);
      return {
        locked: true,
        attemptsRemaining: 0,
        lockedUntil: lockout.lockedUntil,
      };
    }

    this.lockouts.set(identifier, lockout);
    return {
      locked: false,
      attemptsRemaining: this.config.maxFailedAttempts - lockout.attemptCount,
    };
  }

  /**
   * Check if account is locked
   */
  isLocked(identifier: string): boolean {
    const lockout = this.lockouts.get(identifier);
    if (!lockout) return false;

    const now = Date.now();
    if (lockout.lockedUntil > 0 && now < lockout.lockedUntil) {
      return true;
    }

    // Lockout expired, clear it
    if (lockout.lockedUntil > 0 && now >= lockout.lockedUntil) {
      this.lockouts.delete(identifier);
    }

    return false;
  }

  /**
   * Get lockout info
   */
  getLockoutInfo(identifier: string): {
    locked: boolean;
    lockedUntil?: number;
    minutesRemaining?: number;
  } {
    const lockout = this.lockouts.get(identifier);
    if (!lockout || lockout.lockedUntil === 0) {
      return { locked: false };
    }

    const now = Date.now();
    if (now < lockout.lockedUntil) {
      const minutesRemaining = Math.ceil((lockout.lockedUntil - now) / (60 * 1000));
      return {
        locked: true,
        lockedUntil: lockout.lockedUntil,
        minutesRemaining,
      };
    }

    // Lockout expired
    this.lockouts.delete(identifier);
    return { locked: false };
  }

  /**
   * Reset lockout (e.g., after successful login)
   */
  resetLockout(identifier: string): void {
    if (this.config.resetAfterSuccess) {
      this.lockouts.delete(identifier);
    }
  }

  /**
   * Clear all lockouts
   */
  clearAll(): void {
    this.lockouts.clear();
  }
}

// Singleton instance
export const accountRecoveryManager = new AccountRecoveryManager();
