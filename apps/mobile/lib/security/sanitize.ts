/**
 * Input Sanitization Utilities
 * Prevents XSS attacks and sanitizes user-generated content
 */

/**
 * Sanitize HTML string to prevent XSS
 * Removes potentially dangerous HTML tags and attributes
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: URLs that could contain scripts
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove object and embed tags
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  return sanitized.trim();
}

/**
 * Sanitize plain text by removing HTML tags
 */
export function sanitizeText(text: string): string {
  if (!text) return '';

  // Remove all HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized.trim();
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('file:')
  ) {
    return '';
  }

  // Only allow http, https, mailto, tel
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return url.trim();
  }

  // If no protocol, assume https
  if (trimmed.includes('.') && !trimmed.includes(' ')) {
    return `https://${url.trim()}`;
  }

  return '';
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  // Remove whitespace
  let sanitized = email.trim().toLowerCase();

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>'"&]/g, '');

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }

  return sanitized;
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';

  // Remove all non-digit characters except + at the start
  let sanitized = phone.trim();
  if (sanitized.startsWith('+')) {
    sanitized = '+' + sanitized.slice(1).replace(/\D/g, '');
  } else {
    sanitized = sanitized.replace(/\D/g, '');
  }

  return sanitized;
}

/**
 * Escape special characters for use in HTML
 */
export function escapeHtml(text: string): string {
  if (!text) return '';

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Sanitize user input for database queries (additional layer)
 * Note: Supabase handles SQL injection, but this adds extra safety
 */
export function sanitizeForDatabase(input: string): string {
  if (!input) return '';

  // Remove SQL injection patterns
  let sanitized = input
    .replace(/['";]/g, '') // Remove quotes and semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments start
    .replace(/\*\//g, ''); // Remove block comments end

  return sanitized.trim();
}

/**
 * Comprehensive sanitization for user-generated content
 */
export function sanitizeUserContent(content: string, options: {
  allowHtml?: boolean;
  maxLength?: number;
} = {}): string {
  if (!content) return '';

  let sanitized = content;

  // Apply length limit
  if (options.maxLength) {
    sanitized = sanitized.slice(0, options.maxLength);
  }

  // Sanitize based on options
  if (options.allowHtml) {
    sanitized = sanitizeHtml(sanitized);
  } else {
    sanitized = sanitizeText(sanitized);
  }

  return sanitized;
}
