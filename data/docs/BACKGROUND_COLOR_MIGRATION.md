# Background Color Migration Status

## ✅ Completed Files

The following files have been updated to use design system tokens:

1. **app/product/[id].tsx** - All hardcoded rgba values replaced
2. **app/(tabs)/cart.tsx** - All hardcoded rgba values replaced
3. **app/checkout.tsx** - All hardcoded rgba values replaced
4. **app/vendor/[id]/index.tsx** - All hardcoded rgba values replaced
5. **app/order-confirmation.tsx** - All hardcoded hex and rgba values replaced
6. **app/payment.tsx** - All hardcoded rgba values replaced
7. **app/dispute-status.tsx** - All hardcoded rgba values replaced

## 🔄 Remaining Files (Need Updates)

The following files still contain hardcoded rgba values and should be updated:

1. **app/qr-scanner.tsx** - Contains `rgba(0, 0, 0, 0.5)`
2. **app/referrals.tsx** - Contains `rgba(34, 23, 16, 0.85)`
3. **app/vendor/[id]/products.tsx** - Contains `rgba(0, 0, 0, 0.3)`, `rgba(0, 0, 0, 0.5)`
4. **app/onboarding/categories.tsx** - Contains `rgba(0, 0, 0, 0.4)`, `rgba(255, 255, 255, 0.08)`
5. **app/onboarding/heritage.tsx** - Contains `rgba(0, 0, 0, 0.4)`, `rgba(0, 0, 0, 0.35)`
6. **app/dispute-details.tsx** - Contains multiple rgba values
7. **app/report-issue.tsx** - Contains multiple rgba values
8. **app/order-tracking/[id].tsx** - Contains multiple rgba values
9. **app/(tabs)/orders.tsx** - Contains `rgba(255, 255, 255, 0.05)`
10. **app/(tabs)/explore.tsx** - Contains multiple rgba values
11. **app/products.tsx** - Contains multiple rgba values
12. **app/vendors.tsx** - Contains multiple rgba values
13. **app/regions.tsx** - Contains multiple rgba values
14. **app/onboarding/location.tsx** - Contains `rgba(255, 255, 255, 0.1)`
15. **app/(auth)/login.tsx** - Contains `rgba(255, 255, 255, 0.1)`
16. **app/(auth)/forgot-password.tsx** - Contains rgba values
17. **app/notifications.tsx** - May contain rgba values

## Common Replacements Needed

Use these replacements for the remaining files:

```typescript
// White overlays
'rgba(255, 255, 255, 0.05)' → Colors.borderDark or Colors.white05
'rgba(255, 255, 255, 0.08)' → Colors.white08
'rgba(255, 255, 255, 0.1)' → Colors.white10
'rgba(255, 255, 255, 0.15)' → Colors.borderOutline or Colors.white15
'rgba(255, 255, 255, 0.2)' → Colors.white20

// Black overlays
'rgba(0, 0, 0, 0.3)' → Colors.black30
'rgba(0, 0, 0, 0.35)' → Colors.black35
'rgba(0, 0, 0, 0.4)' → Colors.black40
'rgba(0, 0, 0, 0.5)' → Colors.black50
'rgba(0, 0, 0, 0.8)' → Colors.black80

// Primary overlays
'rgba(204, 0, 0, 0.1)' → Colors.primary10
'rgba(204, 0, 0, 0.15)' → Colors.primary15
'rgba(204, 0, 0, 0.2)' → Colors.primary20
'rgba(204, 0, 0, 0.3)' → Colors.primary30

// Secondary overlays
'rgba(255, 204, 0, 0.1)' → Colors.secondary10
'rgba(255, 204, 0, 0.15)' → Colors.secondary15
'rgba(255, 204, 0, 0.2)' → Colors.secondary20

// Success overlays
'rgba(34, 197, 94, 0.1)' → Colors.success10
'rgba(34, 197, 94, 0.15)' → Colors.success15
'rgba(34, 197, 94, 0.2)' → Colors.success20

// Background dark overlays
'rgba(34, 23, 16, 0.85)' → Colors.backgroundDark85
'rgba(34, 23, 16, 0.9)' → Colors.backgroundDark90
```

## Next Steps

1. Update remaining files using the common replacements above
2. Run linter to ensure no errors
3. Test all screens to verify visual consistency
4. Update any custom rgba values that don't match standard patterns
