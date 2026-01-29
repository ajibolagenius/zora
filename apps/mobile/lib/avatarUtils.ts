/**
 * Avatar Utilities for Zora
 * 
 * Generates customer avatars from initials with random color backgrounds
 */

/**
 * Generates initials from a name
 * @param name - Full name (e.g., "John Doe" or "Mary Jane Smith")
 * @returns Initials string (e.g., "JD" or "MS")
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') {
    return '?';
  }
  
  const parts = name.trim().split(/\s+/).filter(part => part.length > 0);
  
  if (parts.length === 0) {
    return '?';
  }
  
  if (parts.length === 1) {
    // Single name: use first two letters
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  // Multiple names: use first letter of first and last name
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates a deterministic color based on a string (name or ID)
 * This ensures the same person always gets the same color
 * @param seed - String to use as seed (e.g., user name or ID)
 * @returns Hex color string (e.g., "#3B82F6")
 */
export function getColorFromSeed(seed: string): string {
  if (!seed || typeof seed !== 'string') {
    seed = 'default';
  }
  
  // Generate a hash from the seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use a curated palette of attractive colors
  // These are modern, accessible colors that work well for avatars
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#A855F7', // Violet
    '#E11D48', // Rose
    '#0EA5E9', // Sky
    '#22C55E', // Emerald
  ];
  
  // Use hash to select a color from the palette
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Generates a random color (non-deterministic)
 * @returns Hex color string
 */
export function getRandomColor(): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#A855F7', // Violet
    '#E11D48', // Rose
    '#0EA5E9', // Sky
    '#22C55E', // Emerald
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Generates avatar data for a customer
 * @param name - Customer name
 * @param userId - Optional user ID for deterministic color (if not provided, uses name)
 * @returns Object with initials and background color
 */
export function generateAvatar(name: string, userId?: string): {
  initials: string;
  backgroundColor: string;
} {
  const initials = getInitials(name);
  const seed = userId || name || 'default';
  const backgroundColor = getColorFromSeed(seed);
  
  return {
    initials,
    backgroundColor,
  };
}

/**
 * Generates an SVG data URL for an avatar
 * This can be used directly in Image components with uri
 * @param name - Customer name
 * @param userId - Optional user ID for deterministic color
 * @param size - Avatar size in pixels (default: 100)
 * @returns Data URL string that can be used as image source
 */
export function generateAvatarDataUrl(
  name: string,
  userId?: string,
  size: number = 100
): string {
  const { initials, backgroundColor } = generateAvatar(name, userId);
  
  // Calculate font size (roughly 40% of avatar size)
  const fontSize = Math.floor(size * 0.4);
  
  // Create SVG
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size / 2}"/>
      <text
        x="50%"
        y="50%"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="${fontSize}"
        font-weight="600"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central"
      >${initials}</text>
    </svg>
  `.trim();
  
  // Convert to base64 data URL
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}
