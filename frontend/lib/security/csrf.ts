/**
 * CSRF Protection Utilities
 * Generates and validates CSRF tokens for state-changing operations
 */

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  // Generate a random token using crypto if available, otherwise Math.random
  const array = new Uint8Array(32);
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }

  // Convert to hex string
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Store CSRF token (using sessionStorage for web, AsyncStorage for native)
 */
export async function storeCsrfToken(token: string): Promise<void> {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      // Web: use sessionStorage
      sessionStorage.setItem('csrf_token', token);
    } else {
      // Native: use AsyncStorage
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem('csrf_token', token);
    }
  } catch (error) {
    console.error('Failed to store CSRF token:', error);
  }
}

/**
 * Retrieve CSRF token
 */
export async function getCsrfToken(): Promise<string | null> {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      // Web: use sessionStorage
      return sessionStorage.getItem('csrf_token');
    } else {
      // Native: use AsyncStorage
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      return await AsyncStorage.getItem('csrf_token');
    }
  } catch (error) {
    console.error('Failed to retrieve CSRF token:', error);
    return null;
  }
}

/**
 * Validate CSRF token
 */
export async function validateCsrfToken(token: string): Promise<boolean> {
  const storedToken = await getCsrfToken();
  if (!storedToken) return false;
  
  // Constant-time comparison to prevent timing attacks
  if (token.length !== storedToken.length) return false;
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Clear CSRF token
 */
export async function clearCsrfToken(): Promise<void> {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('csrf_token');
    } else {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.removeItem('csrf_token');
    }
  } catch (error) {
    console.error('Failed to clear CSRF token:', error);
  }
}

/**
 * Generate and store a new CSRF token
 */
export async function initializeCsrfToken(): Promise<string> {
  const token = generateCsrfToken();
  await storeCsrfToken(token);
  return token;
}
