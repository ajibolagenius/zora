# Zora African Market - Email Templates

This directory contains HTML email templates for various authentication and notification scenarios in the Zora African Market application.

## Design System Compliance

All email templates follow the Zora Design System guidelines:

- **Colors**: 
  - Primary: `#CC0000` (Zora Red) for CTAs and buttons
  - Secondary: `#FFCC00` (Zora Yellow) for accents and highlights
  - Background Dark: `#221710` (warm brown)
  - Card Dark: `#342418`
  - Text Primary: `#FFFFFF`
  - Text Secondary: `#CBA990`

- **Typography**:
  - All text: Poppins (Regular, Medium, SemiBold, Bold)
  - Font sizes follow design system scale (h1: 28px, h2: 24px, body: 16px, small: 14px, caption: 12px)
  - Letter spacing: 0px for headings/body, 0.5px for buttons/labels

- **Layout**:
  - Border radius: 12px for containers and buttons
  - Consistent spacing and padding
  - Responsive design (max-width: 600px)

## Available Templates

### 1. Confirm Signup (`confirm-signup.html`)
**Subject**: Confirm Your Signup

Used when a new user signs up and needs to confirm their email address.

**Variables**:
- `{{ .ConfirmationURL }}` - The confirmation link

### 2. Reset Password (`reset-password.html`)
**Subject**: Reset Your Password

Sent when a user requests a password reset.

**Variables**:
- `{{ .ConfirmationURL }}` - The password reset link

### 3. Magic Link (`magic-link.html`)
**Subject**: Your Magic Link

Used for passwordless authentication via email link.

**Variables**:
- `{{ .ConfirmationURL }}` - The magic link for login

### 4. Reauthentication (`reauthentication.html`)
**Subject**: Confirm Reauthentication

Sent when a user needs to re-authenticate for sensitive actions.

**Variables**:
- `{{ .Token }}` - The verification code

### 5. Password Changed (`password-changed.html`)
**Subject**: Your password has been changed

Notification sent after a password change is completed.

**Variables**:
- `{{ .Email }}` - The user's email address

## Supabase Integration

These templates are designed to work with Supabase Auth email templates. To use them:

1. Navigate to your Supabase project dashboard
2. Go to Authentication > Email Templates
3. Select the appropriate template (Confirm signup, Reset password, etc.)
4. Copy the HTML content from the corresponding file
5. Paste it into the Supabase email template editor
6. Save changes

## Template Variables

Supabase provides the following variables that can be used in templates:

- `{{ .ConfirmationURL }}` - Confirmation/reset link
- `{{ .Token }}` - Verification token/code
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address
- `{{ .Data }}` - Additional data object
- `{{ .RedirectTo }}` - Redirect URL after action

## Email Client Compatibility

These templates are designed to work across major email clients:

- ✅ Gmail (Web, iOS, Android)
- ✅ Apple Mail (iOS, macOS)
- ✅ Outlook (Web, Desktop)
- ✅ Yahoo Mail
- ✅ Mobile email clients

The templates use:
- Inline CSS for maximum compatibility
- Table-based layouts for email client support
- MSO conditional comments for Outlook
- Responsive design with max-width constraints

## Customization

To customize these templates:

1. Maintain the overall structure and layout
2. Update colors to match any design system changes
3. Ensure all Supabase variables are preserved
4. Test in multiple email clients before deploying
5. Keep the responsive design intact (600px max-width)

## Testing

Before deploying:

1. Test each template in multiple email clients
2. Verify all links work correctly
3. Check that variables are properly replaced
4. Ensure mobile responsiveness
5. Validate HTML structure

## Notes

- All templates use inline styles for email client compatibility
- Font fallbacks are included for systems without Poppins
- Links use the Zora Yellow (`#FFCC00`) color for visibility
- Security messages are prominently displayed where applicable
- Footer includes copyright with dynamic year (updates automatically via JavaScript)
- All typography uses Poppins font family for consistency with the app design system
