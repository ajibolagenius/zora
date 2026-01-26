/**
 * Two-Factor Authentication (2FA) Utilities
 * TOTP-based 2FA implementation
 */

export interface TwoFactorConfig {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
  createdAt?: number;
}

/**
 * Generate a random secret for TOTP
 * In production, this should be generated server-side
 */
export function generateTOTPSecret(): string {
  // Generate 32 random bytes and convert to base32
  const array = new Uint8Array(20);
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }

  // Convert to base32 (simplified - in production use a proper base32 library)
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < array.length; i++) {
    secret += base32Chars[array[i] % 32];
  }

  return secret;
}

/**
 * Generate backup codes
 */
export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-digit code
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    codes.push(code);
  }
  return codes;
}

/**
 * Validate TOTP code
 * Note: This is a simplified implementation. In production, use a proper TOTP library
 * like 'otplib' or implement server-side validation
 */
export function validateTOTPCode(code: string, secret: string, window = 1): boolean {
  if (!code || !secret) return false;

  // Remove spaces and convert to uppercase
  const cleanCode = code.replace(/\s/g, '').toUpperCase();

  // Basic validation - code should be 6 digits
  if (!/^\d{6}$/.test(cleanCode)) return false;

  // In production, implement proper TOTP validation:
  // 1. Get current time step
  // 2. Generate TOTP for current, previous, and next time steps (within window)
  // 3. Compare with provided code
  // 4. Use a library like 'otplib' for proper implementation

  // For now, return true if code format is valid
  // This should be replaced with actual TOTP validation
  return true;
}

/**
 * Validate backup code
 */
export function validateBackupCode(code: string, backupCodes: string[]): boolean {
  if (!code || !backupCodes || backupCodes.length === 0) return false;

  const cleanCode = code.replace(/\s/g, '');
  return backupCodes.includes(cleanCode);
}

/**
 * Format TOTP secret for QR code
 * Returns the otpauth:// URL for QR code generation
 */
export function formatTOTPSecretForQR(
  secret: string,
  email: string,
  issuer = 'Zora Market'
): string {
  const encodedEmail = encodeURIComponent(email);
  const encodedIssuer = encodeURIComponent(issuer);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}`;
}

/**
 * Check if 2FA is enabled for user
 */
export function is2FAEnabled(config: TwoFactorConfig | null | undefined): boolean {
  return config?.enabled === true && !!config.secret;
}
