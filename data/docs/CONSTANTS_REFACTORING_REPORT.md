# Constants Refactoring & Improvements Report

## Executive Summary

This report identifies constants that need to be created, files requiring refactoring, and opportunities for improvements across the Zora African Market frontend codebase.

---

## 1. Constants to Create

### 1.1 Business Logic Constants (`constants/business.ts`)

**Scoring & Ranking Constants:**
- `SCORING_WEIGHTS` (from `rankingService.ts`) - Should be extracted to constants
- Delivery time thresholds (30, 45, 60, 90 minutes)
- Recency bonus thresholds (30, 90 days)
- Regional match bonus (5 points)
- Certification bonus (2 points)
- Minimum quality thresholds (rating >= 3.5, review_count >= 5)

**Cart & Pricing Constants:**
- Delivery fee per vendor: `2.99` (hardcoded in `cartStore.ts`)
- Service fee calculation
- Minimum order amount: `5.0` (already in config, but verify usage)
- Payment method limits (Stripe, Klarna, Clearpay min/max amounts)

**Dispute & Resolution Constants:**
- `RESOLUTION_OPTIONS` (from `dispute-details.tsx`) - Should be in constants
- Dispute timeline steps
- Evidence requirements

### 1.2 Image & Asset Constants (`constants/assets.ts`)

**Placeholder Images:**
- Default product image
- Default vendor logo
- Default avatar image
- Default cover image
- Fallback image URLs

**Image Size Presets:**
- Thumbnail sizes (100, 200, 400, 600, 800)
- Avatar sizes (40, 48, 80, 100, 200)
- Cover image sizes

**Image Service URLs:**
- Unsplash base URL patterns
- Dicebear API patterns
- QR code service patterns

### 1.3 UI Dimension Constants (Extend `constants/spacing.ts`)

**Common Component Dimensions:**
- Avatar sizes (already partially in `AvatarStyles`, but many hardcoded)
- Icon button sizes (44, 48, etc.)
- Status indicator sizes
- Badge dimensions
- Card heights
- Input field heights (some hardcoded as 40, 48, 52, 56)

**Spacing Patterns:**
- Many hardcoded gaps (2, 4, 6, 8, 12, 16, 20, 24, 32)
- Section spacing (100, 120, 140, 200)
- Border widths (1, 1.5, 2, 3, 4)

### 1.4 Animation Constants (Extend `constants/animations.ts`)

**Additional Animation Values:**
- Many hardcoded durations (250, 300, 350, 400, 500, 1000, 1200)
- Easing configurations
- Delay values
- Stagger delays

### 1.5 Text & Messaging Constants (`constants/messages.ts`)

**Error Messages:**
- Authentication errors
- Validation errors
- Network errors
- Form errors

**Success Messages:**
- Profile updates
- Password changes
- Order confirmations
- Referral codes copied

**Placeholder Text:**
- Input placeholders (many hardcoded)
- Search placeholders
- Empty state messages

**Alert Messages:**
- Confirmation dialogs
- Warning messages
- Info messages

### 1.6 Validation Constants (Extend `constants/config.ts`)

**Password Rules:**
- Minimum length: `8` (hardcoded in `change-password.tsx`)
- Complexity requirements

**Form Validation:**
- Email format
- Phone format
- Postcode format (UK)
- Name length limits

### 1.7 Date & Time Constants (`constants/datetime.ts`)

**Time Formats:**
- Date display formats
- Time display formats
- Relative time thresholds

**Time Calculations:**
- Milliseconds per day: `1000 * 60 * 60 * 24` (hardcoded in rankingService)
- Days in periods (30, 90 days)

---

## 2. Files Requiring Refactoring

### 2.1 High Priority

**`services/rankingService.ts`**
- Extract `SCORING_WEIGHTS` to `constants/business.ts`
- Extract magic numbers (30, 45, 60, 90, 5, 2) to constants
- Extract time calculations to constants

**`stores/cartStore.ts`**
- Extract delivery fee `2.99` to `PaymentConfig.deliveryFeePerVendor`
- Extract placeholder image URL to `constants/assets.ts`

**`app/dispute-details.tsx`**
- Extract `RESOLUTION_OPTIONS` to `constants/app.ts`
- Extract `MAX_CHARS` and `MAX_PHOTOS` (already in config, but not imported)
- Extract `SELECTED_ITEMS` mock data (should be in mock data service)

**`app/(tabs)/orders.tsx`**
- Replace hardcoded status colors (already done, but verify)
- Extract `MOCK_ORDERS` to mock data service
- Extract hardcoded image URLs

**`app/referrals.tsx`**
- Extract hardcoded referral amounts (`£10`)
- Extract share message template
- Extract default referral code pattern

**`app/order-support/[id].tsx`**
- Extract `INITIAL_MESSAGES` to constants or mock data
- Extract `QUICK_REPLIES` (already in constants, but not imported)

**`app/dispute-status.tsx`**
- Extract `TIMELINE_STEPS` to constants
- Extract `AFFECTED_ITEMS` and `EVIDENCE_IMAGES` to mock data

### 2.2 Medium Priority

**All Screen Files with Hardcoded Dimensions:**
- `app/vendor/[id]/index.tsx` - Many hardcoded sizes
- `app/product/[id].tsx` - Hardcoded dimensions
- `app/(tabs)/index.tsx` - `PRODUCT_GAP` should use `UiConfig.productGap`
- `app/products.tsx` - Same `PRODUCT_GAP` issue
- `app/onboarding/heritage.tsx` - Hardcoded header calculations

**Animation Files:**
- All files using hardcoded animation durations should import from `AnimationDuration`
- Files: Most screen files have hardcoded `duration: 400`, `duration: 300`, etc.

**Image URL Files:**
- Files with hardcoded Unsplash URLs should use placeholder constants
- Files: `externalApi.ts`, `app/(tabs)/orders.tsx`, `app/dispute-details.tsx`, etc.

### 2.3 Low Priority

**Component Files:**
- `components/ui/FeaturedSlider.tsx` - Already updated, verify
- `components/ui/ProductCard.tsx` - Check for hardcoded values
- `components/ui/Badge.tsx` - Verify all values use constants

**Service Files:**
- `services/paymentService.ts` - Extract payment method limits to constants
- `services/externalApi.ts` - Some image URLs still hardcoded

---

## 3. Improvements & Enhancements

### 3.1 Constants Organization

**Current Structure:**
```
constants/
  ├── colors.ts
  ├── spacing.ts
  ├── typography.ts
  ├── componentStyles.ts
  ├── animations.ts (NEW)
  ├── api.ts (NEW)
  ├── config.ts (NEW)
  ├── app.ts (NEW)
  └── index.ts
```

**Recommended Additions:**
```
constants/
  ├── business.ts (NEW) - Scoring, pricing, cart logic
  ├── assets.ts (NEW) - Images, placeholders, URLs
  ├── messages.ts (NEW) - Error/success messages, placeholders
  ├── datetime.ts (NEW) - Date/time formats and calculations
  └── validation.ts (NEW) - Validation rules and patterns
```

### 3.2 Type Safety Improvements

**Create Type Definitions:**
- `types/constants.ts` - Type definitions for all constants
- Ensure all constants are properly typed
- Use `as const` assertions where appropriate

### 3.3 Consistency Improvements

**Standardize Naming:**
- Some constants use `SCREAMING_SNAKE_CASE`, others use `camelCase`
- Recommendation: Use `camelCase` for object properties, `SCREAMING_SNAKE_CASE` only for top-level constants

**Standardize Imports:**
- Some files import from individual files (`colors.ts`), others from `index.ts`
- Recommendation: Always import from `constants/index.ts` for consistency

### 3.4 Code Quality Improvements

**Remove Duplication:**
- Multiple files define similar constants (e.g., `PRODUCT_GAP`)
- Multiple files have hardcoded animation durations
- Multiple files have hardcoded image URLs

**Extract Magic Numbers:**
- Replace all magic numbers with named constants
- Makes code more readable and maintainable

**Improve Documentation:**
- Add JSDoc comments to all constant objects
- Document usage examples
- Document when to use which constant

### 3.5 Performance Improvements

**Memoization Opportunities:**
- Constants that are computed (like shuffled colors) could be memoized
- Consider using `useMemo` for derived constants in components

**Bundle Size:**
- Ensure constants are tree-shakeable
- Use named exports instead of default exports where possible

### 3.6 Testing Improvements

**Test Constants:**
- Create unit tests for constant values
- Ensure constants are valid (e.g., colors are valid hex, sizes are positive)
- Test constant combinations

---

## 4. Specific Refactoring Tasks

### Task 1: Create Business Constants
- [x] Create `constants/business.ts` ✅
- [x] Extract scoring weights from `rankingService.ts` ✅
- [x] Extract delivery fee from `cartStore.ts` ✅
- [x] Extract payment limits from `paymentService.ts` ✅ (Payment limits extracted and used in paymentService.ts)
- [x] Extract resolution options from `dispute-details.tsx` ✅

### Task 2: Create Asset Constants
- [x] Create `constants/assets.ts` ✅
- [x] Define placeholder image URLs ✅
- [x] Define image size presets ✅
- [x] Create helper functions for image URL generation ✅

### Task 3: Create Messages Constants
- [x] Create `constants/messages.ts` ✅
- [x] Extract all error messages ✅
- [x] Extract all success messages ✅
- [x] Extract all placeholder text ✅
- [x] Extract all alert messages ✅

### Task 4: Extend Existing Constants
- [x] Add missing dimensions to `spacing.ts` ✅ (Added Dimensions, BorderWidths, Gaps, additional Heights)
- [x] Add missing animation values to `animations.ts` ✅ (Already comprehensive with all durations)
- [x] Add missing validation rules to `config.ts` ✅ (Added password validation limits)
- [x] Add missing app constants to `app.ts` ✅ (Added ResolutionOptions)

### Task 5: Refactor Files to Use Constants
- [x] Update all screen files to use animation constants ✅ (20+ files refactored: index.tsx, products.tsx, cart.tsx, vendor screens, onboarding screens, etc.)
- [x] Update all files to use dimension constants ✅ (FeaturedSlider.tsx, vendor screens, product screens, and many others)
- [x] Update all files to use image constants ✅ (15+ files refactored: cartStore.ts, dispute-details.tsx, search.tsx, profile.tsx, vendor screens, product screens, etc.)
- [x] Update all files to use message constants ✅ (12+ files refactored: login.tsx, change-password.tsx, personal.tsx, addresses.tsx, referrals.tsx, chat screens, etc.)
- [x] Update all files to use business constants ✅ (rankingService.ts, cartStore.ts, dispute-details.tsx, paymentService.ts refactored)

### Task 6: Improve Type Safety
- [x] Create type definitions for constants ✅ (Created `types/constants.ts` with comprehensive type definitions)
- [x] Add proper TypeScript types ✅ (All constants properly typed)
- [x] Use `as const` where appropriate ✅ (Used extensively - all constant objects use `as const`)

### Task 7: Documentation
- [x] Add JSDoc to all constants ✅ (JSDoc comments added to all new constant files)
- [x] Create usage examples ✅ (Created `REFACTORING_IMPLEMENTATION_SUMMARY.md` with comprehensive implementation details)
- [ ] Document best practices ⚠️ (Best practices documented in summary, but could be expanded into separate guide)

---

## 5. Priority Matrix

### High Priority (Do First)
1. Extract business logic constants (scoring, pricing)
2. Extract hardcoded image URLs
3. Replace hardcoded animation durations
4. Extract error/success messages

### Medium Priority (Do Next)
1. Extract UI dimensions
2. Standardize imports
3. Improve type safety
4. Remove duplication

### Low Priority (Nice to Have)
1. Performance optimizations
2. Additional documentation
3. Testing improvements
4. Code style consistency

---

## 6. Estimated Impact

**Files Affected:** ~50+ files
**Constants to Create:** ~100+ new constants
**Lines of Code to Refactor:** ~500+ lines
**Maintainability Improvement:** High
**Type Safety Improvement:** Medium
**Performance Impact:** Minimal (positive)

---

## 7. Recommendations

1. **Start with High Priority Items** - Focus on business logic and frequently used constants
2. **Incremental Refactoring** - Don't try to refactor everything at once
3. **Test After Each Change** - Ensure refactoring doesn't break functionality
4. **Document as You Go** - Add comments and examples for new constants
5. **Use TypeScript Strictly** - Leverage TypeScript for type safety
6. **Create Helper Functions** - For computed constants (e.g., image URL builders)

---

## 8. Next Steps

1. Review and approve this report
2. Prioritize tasks based on business needs
3. Create implementation plan
4. Begin with high-priority constants
5. Gradually refactor files
6. Add tests for constants
7. Update documentation

---

*Report generated: 2026-01-26*
*Codebase: Zora African Market Frontend*
