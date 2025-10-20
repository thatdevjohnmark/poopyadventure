# Email Templates Setup Guide

## Overview
Custom email templates for Supabase Auth with royal blue design system matching your Poop Tracker app.

## Templates Included

1. **email-template-signup.html** - Email confirmation for new signups
2. **email-template-recovery.html** - Password reset emails

## Design Features

✅ **Royal Blue Theme** (#4169E1, #002BD8)
✅ **Mobile-Responsive** (works on all devices)
✅ **Professional Layout** (HTML tables for email compatibility)
✅ **Brand Consistency** (matches your app design)
✅ **Security Features** (expiration notices, security warnings)

## How to Upload to Supabase

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/rhxuivbxxwaccbaltqbr
2. Click on **Authentication** in the left sidebar
3. Click on **Email Templates**

### Step 2: Configure Signup Email
1. Select **Confirm signup** template
2. Open `email-template-signup.html` in a text editor
3. Copy ALL the HTML code
4. Paste it into the Supabase email template editor
5. Click **Save**

### Step 3: Configure Password Recovery Email
1. Select **Reset password** template
2. Open `email-template-recovery.html` in a text editor
3. Copy ALL the HTML code
4. Paste it into the Supabase email template editor
5. Click **Save**

### Step 4: Test the Templates
1. Try signing up with a new account
2. Check your email for the styled confirmation
3. Try password reset to test recovery email

## Template Variables

These variables are automatically replaced by Supabase:

- `{{ .ConfirmationURL }}` - The confirmation or reset link
- `{{ .Token }}` - The verification token (if needed)
- `{{ .Email }}` - User's email address (if needed)
- `{{ .SiteURL }}` - Your site URL (if needed)

## Customization Tips

### Change Colors
Find and replace these hex codes:
- `#4169E1` - Primary royal blue
- `#002BD8` - Dark royal blue
- `#F4FDFF` - Light blue background
- `#F7E7CE` - Champagne accent

### Change Logo
Replace the emoji `🚽` with:
- Your logo image URL: `<img src="YOUR_LOGO_URL" width="64" height="64" />`
- Different emoji
- Font Awesome icon (requires CDN link)

### Update Text
Edit the HTML to change:
- Greeting messages
- Feature lists
- Footer text
- Company name

## Testing Checklist

- [ ] Signup email arrives
- [ ] Links work correctly
- [ ] Design looks good on mobile
- [ ] Design looks good in Gmail
- [ ] Design looks good in Outlook
- [ ] Password reset email arrives
- [ ] All colors match app theme

## Troubleshooting

**Emails not arriving?**
- Check spam folder
- Verify email settings in Supabase (Authentication > Email Auth)
- Make sure email confirmation is enabled

**Template not rendering?**
- Some email clients don't support CSS
- Our templates use inline styles (compatible with most clients)
- Test in multiple email apps

**Links broken?**
- Check Site URL in Supabase settings
- Verify redirect URLs are allowed in Authentication settings

## Email Client Compatibility

✅ **Fully Supported:**
- Gmail (Web, iOS, Android)
- Apple Mail (macOS, iOS)
- Outlook (Web, Desktop)
- Yahoo Mail
- ProtonMail

⚠️ **Limited Support:**
- Older versions of Outlook (may show basic styling)

## Resources

- [Supabase Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email Template Best Practices](https://www.emailonacid.com/blog/)
- [HTML Email Testing](https://litmus.com/)

## Support

Need help? Check:
1. Supabase dashboard logs
2. Browser console errors
3. Email delivery logs in Supabase

---

**Note:** After uploading, emails will be sent automatically when users sign up or request password resets.
