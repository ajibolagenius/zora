# Zora Design System - Color Usage Guide

## Background Color Standards

### Standardized Background Colors

All background colors should use the predefined tokens from `Colors` to ensure consistency across the app.

#### White Overlays (for cards, surfaces on dark background)
- `Colors.white03` - Very subtle card backgrounds
- `Colors.white05` - Subtle borders, dividers (same as `Colors.borderDark`)
- `Colors.white08` - Light card backgrounds
- `Colors.white10` - Card backgrounds, input fields
- `Colors.white15` - Outlined elements (same as `Colors.borderOutline`)
- `Colors.white20` - Hover states, active backgrounds

#### Black Overlays (for overlays, modals, dark surfaces)
- `Colors.black30` - Light overlays, button backgrounds
- `Colors.black35` - Medium overlays
- `Colors.black40` - Medium-dark overlays
- `Colors.black50` - Dark overlays, backdrops
- `Colors.black80` - Very dark overlays, modals

#### Primary (Red) Overlays
- `Colors.primary05` - Very subtle primary accents
- `Colors.primary10` - Subtle primary backgrounds
- `Colors.primary15` - Light primary backgrounds
- `Colors.primary20` - Primary badge backgrounds
- `Colors.primary30` - Medium primary backgrounds
- `Colors.primary50` - Disabled primary states

#### Secondary (Yellow) Overlays
- `Colors.secondary10` - Subtle secondary accents
- `Colors.secondary15` - Light secondary backgrounds
- `Colors.secondary20` - Secondary badge backgrounds
- `Colors.secondary26` - ~15% opacity (commonly used)
- `Colors.secondary33` - 20% opacity

#### Success (Green) Overlays
- `Colors.success10` / `Colors.success1A` - Subtle success backgrounds
- `Colors.success15` - Light success backgrounds
- `Colors.success20` - Success badge backgrounds

#### Info (Blue) Overlays
- `Colors.info10` - Subtle info backgrounds
- `Colors.info20` - Info badge backgrounds

#### Background Dark Overlays
- `Colors.backgroundDark85` - Semi-transparent dark background
- `Colors.backgroundDark90` - More opaque dark background

## Opacity Hex Values Reference

When using hex color format with opacity suffix (e.g., `#CC000020`), use these hex values:

| Opacity | Hex Value | Decimal | Use Case |
|---------|-----------|---------|----------|
| 5% | 0D | 13 | Very subtle accents |
| 10% | 1A | 26 | Subtle backgrounds |
| 15% | 26 | 38 | Light backgrounds |
| 20% | 33 | 51 | Badge backgrounds |
| 25% | 40 | 64 | Medium backgrounds |
| 30% | 4D | 77 | Medium-strong backgrounds |
| 40% | 66 | 102 | Strong backgrounds |
| 50% | 80 | 128 | Semi-transparent |
| 60% | 99 | 153 | More opaque |
| 70% | B3 | 179 | Strong opacity |
| 80% | CC | 204 | Very strong opacity |
| 90% | E6 | 230 | Almost opaque |
| 95% | F2 | 242 | Nearly opaque |

### Usage Examples

```typescript
// ✅ CORRECT - Using predefined tokens
backgroundColor: Colors.primary20
backgroundColor: Colors.secondary15
backgroundColor: Colors.white10

// ✅ ACCEPTABLE - Using hex opacity format (when token doesn't exist)
backgroundColor: `${Colors.primary}20`  // 20% opacity
backgroundColor: `${Colors.secondary}26` // ~15% opacity
backgroundColor: `${Colors.success}1A`  // 10% opacity

// ❌ WRONG - Hardcoded rgba values
backgroundColor: 'rgba(255, 255, 255, 0.1)'
backgroundColor: 'rgba(255, 204, 0, 0.15)'
backgroundColor: 'rgba(16, 185, 129, 0.1)'
```

## Migration Guide

### Common Replacements

| Old (Hardcoded) | New (Design System) |
|----------------|---------------------|
| `rgba(255, 255, 255, 0.03)` | `Colors.white03` |
| `rgba(255, 255, 255, 0.05)` | `Colors.borderDark` or `Colors.white05` |
| `rgba(255, 255, 255, 0.08)` | `Colors.white08` |
| `rgba(255, 255, 255, 0.1)` | `Colors.white10` |
| `rgba(255, 255, 255, 0.15)` | `Colors.borderOutline` or `Colors.white15` |
| `rgba(255, 255, 255, 0.2)` | `Colors.white20` |
| `rgba(0, 0, 0, 0.3)` | `Colors.black30` |
| `rgba(0, 0, 0, 0.4)` | `Colors.black40` |
| `rgba(0, 0, 0, 0.5)` | `Colors.black50` |
| `rgba(204, 0, 0, 0.1)` | `Colors.primary10` |
| `rgba(204, 0, 0, 0.15)` | `Colors.primary15` |
| `rgba(204, 0, 0, 0.2)` | `Colors.primary20` |
| `rgba(204, 0, 0, 0.3)` | `Colors.primary30` |
| `rgba(255, 204, 0, 0.1)` | `Colors.secondary10` |
| `rgba(255, 204, 0, 0.15)` | `Colors.secondary15` or `Colors.secondary26` |
| `rgba(255, 204, 0, 0.2)` | `Colors.secondary20` or `Colors.secondary33` |
| `rgba(34, 197, 94, 0.1)` | `Colors.success10` or `Colors.success1A` |
| `rgba(34, 197, 94, 0.15)` | `Colors.success15` |
| `rgba(34, 197, 94, 0.2)` | `Colors.success20` |
| `rgba(59, 130, 246, 0.1)` | `Colors.info10` |
| `rgba(59, 130, 246, 0.2)` | `Colors.info20` |
| `rgba(34, 23, 16, 0.85)` | `Colors.backgroundDark85` |
| `rgba(34, 23, 16, 0.9)` | `Colors.backgroundDark90` |

## Best Practices

1. **Always use design system tokens** - Never hardcode rgba or hex colors with opacity
2. **Prefer predefined tokens** - Use `Colors.primary20` over `${Colors.primary}20` when available
3. **Be consistent** - Use the same opacity level for similar UI elements across screens
4. **Document exceptions** - If you need a custom opacity, add it to the design system first
