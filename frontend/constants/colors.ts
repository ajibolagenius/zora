// Zora African Market Design Tokens - Colors
export const Colors = {
  // Primary Colors
  primary: '#CC0000',        // Zora Red - buttons, CTAs, active states
  primaryDark: '#A30000',    // Hover/pressed state
  secondary: '#FFCC00',      // Zora Yellow - prices, accents, ratings
  secondaryDark: '#E6B800',  // Hover/pressed state
  
  // Background Colors
  backgroundDark: '#221710', // Dark mode background (warm brown)
  cardDark: '#342418',       // Dark mode cards/surfaces
  backgroundLight: '#F8F7F5',// Light mode background
  
  // Text Colors
  textPrimary: '#FFFFFF',    // Dark mode text
  textSecondary: '#CBA990',  // Secondary/placeholder text
  textLight: '#505050',      // Light mode text
  textMuted: '#CBA990',      // Muted text
  
  // Status Colors
  success: '#22C55E',
  warning: '#FFCC00',
  error: '#CC0000',
  info: '#3B82F6',
  
  // Border Colors
  borderDark: 'rgba(255, 255, 255, 0.05)',
  borderLight: 'rgba(0, 0, 0, 0.05)',
  borderOutline: 'rgba(255, 255, 255, 0.15)', // For outlined pills/tags
  
  // Overlay
  overlay: 'rgba(34, 23, 16, 0.8)',
  overlayLight: 'rgba(255, 255, 255, 0.95)',
  
  // Tab Bar
  tabBarBackground: 'rgba(31, 22, 16, 0.95)',
  tabBarActive: '#CC0000',
  tabBarInactive: '#505050',
  
  // Rating
  rating: '#FFCC00',
  
  // Badges
  badgeHot: '#CC0000',
  badgePopular: '#CC0000',
  badgeNew: '#22C55E',
  badgeTopRated: '#FFCC00',
  badgeOrganic: '#22C55E',
  badgeEcoFriendly: '#14B8A6',
  
  // Standardized Background Colors with Opacity
  // Use these for consistent background colors across the app
  // Format: base color + hex opacity suffix (e.g., primary10 = 10% opacity)
  
  // White overlays (for cards, surfaces on dark background)
  white03: 'rgba(255, 255, 255, 0.03)',  // Very subtle card backgrounds
  white05: 'rgba(255, 255, 255, 0.05)',  // Subtle borders, dividers (same as borderDark)
  white08: 'rgba(255, 255, 255, 0.08)',  // Light card backgrounds
  white10: 'rgba(255, 255, 255, 0.1)',   // Card backgrounds, input fields
  white15: 'rgba(255, 255, 255, 0.15)',  // Outlined elements (same as borderOutline)
  white20: 'rgba(255, 255, 255, 0.2)',   // Hover states, active backgrounds
  
  // Black overlays (for overlays, modals, dark surfaces)
  black30: 'rgba(0, 0, 0, 0.3)',   // Light overlays, button backgrounds
  black35: 'rgba(0, 0, 0, 0.35)',  // Medium overlays
  black40: 'rgba(0, 0, 0, 0.4)',   // Medium-dark overlays
  black50: 'rgba(0, 0, 0, 0.5)',   // Dark overlays, backdrops
  black80: 'rgba(0, 0, 0, 0.8)',   // Very dark overlays, modals
  
  // Primary (Red) overlays
  primary05: 'rgba(204, 0, 0, 0.05)',   // Very subtle primary accents
  primary10: 'rgba(204, 0, 0, 0.1)',    // Subtle primary backgrounds
  primary15: 'rgba(204, 0, 0, 0.15)',   // Light primary backgrounds
  primary20: 'rgba(204, 0, 0, 0.2)',    // Primary badge backgrounds
  primary30: 'rgba(204, 0, 0, 0.3)',    // Medium primary backgrounds
  primary50: 'rgba(204, 0, 0, 0.5)',    // Disabled primary states
  
  // Secondary (Yellow) overlays
  secondary10: 'rgba(255, 204, 0, 0.1)',  // Subtle secondary accents
  secondary15: 'rgba(255, 204, 0, 0.15)', // Light secondary backgrounds
  secondary20: 'rgba(255, 204, 0, 0.2)',  // Secondary badge backgrounds
  secondary26: 'rgba(255, 204, 0, 0.26)', // 15% opacity (hex: 26)
  secondary33: 'rgba(255, 204, 0, 0.33)', // 20% opacity (hex: 33)
  
  // Success (Green) overlays
  success10: 'rgba(34, 197, 94, 0.1)',    // Subtle success backgrounds
  success15: 'rgba(34, 197, 94, 0.15)',  // Light success backgrounds
  success20: 'rgba(34, 197, 94, 0.2)',   // Success badge backgrounds
  success1A: 'rgba(34, 197, 94, 0.1)',   // 10% opacity (hex: 1A) - alias for success10
  
  // Info (Blue) overlays
  info10: 'rgba(59, 130, 246, 0.1)',     // Subtle info backgrounds
  info20: 'rgba(59, 130, 246, 0.2)',     // Info badge backgrounds
  
  // Background dark overlays (for layered dark surfaces)
  backgroundDark85: 'rgba(34, 23, 16, 0.85)', // Semi-transparent dark background
  backgroundDark90: 'rgba(34, 23, 16, 0.9)',  // More opaque dark background
};

/**
 * Opacity Hex Values Reference
 * 
 * When using hex color format with opacity (e.g., #CC000020), use these hex values:
 * 
 * 5%  = 0D (13 in decimal)
 * 10% = 1A (26 in decimal)
 * 15% = 26 (38 in decimal) - Note: 26 hex = 38 decimal, but commonly used for ~15%
 * 20% = 33 (51 in decimal)
 * 25% = 40 (64 in decimal)
 * 30% = 4D (77 in decimal)
 * 40% = 66 (102 in decimal)
 * 50% = 80 (128 in decimal)
 * 60% = 99 (153 in decimal)
 * 70% = B3 (179 in decimal)
 * 80% = CC (204 in decimal)
 * 90% = E6 (230 in decimal)
 * 95% = F2 (242 in decimal)
 * 
 * Usage examples:
 * - `${Colors.primary}20` = #CC000020 (primary with 20% opacity)
 * - `${Colors.secondary}26` = #FFCC0026 (secondary with ~15% opacity)
 * - `${Colors.success}1A` = #22C55E1A (success with 10% opacity)
 * 
 * Note: For consistency, prefer using the predefined rgba values above
 * (e.g., Colors.primary20) over hex opacity format when possible.
 */

export default Colors;
