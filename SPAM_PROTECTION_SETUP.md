# Spam Protection Setup Guide

Your contact form now has 4 layers of spam protection:

## 🛡️ Security Layers

### 1. **Cloudflare Turnstile** (CAPTCHA Alternative)
   - User-friendly challenge that verifies humans
   - No annoying image selection puzzles
   - Required for form submission

### 2. **Honeypot Field**
   - Hidden field that only bots fill out
   - If filled, submission is silently rejected
   - Zero user friction

### 3. **Rate Limiting**
   - Max 3 submissions per hour per IP+email combo
   - Minimum 30 seconds between submissions
   - Prevents spam floods

### 4. **Server-Side Heuristics**
   - **Minimum message length**: 20 characters required
   - **Timing check**: Submissions faster than 2 seconds are rejected
   - **Link detection**: Max 2 links allowed in message
   - **Spam keyword detection**: Blocks common spam terms
   - **Duplicate detection**: Same message can't be sent twice
   - **Word repetition check**: Excessive repetition blocked

## 📋 Setup Instructions

### Step 1: Get Cloudflare Turnstile Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile** section (or search for it)
3. Click **"Add Site"** or **"Create Widget"**
4. Configure your widget:
   - **Domain**: `artriot.live` (or your domain)
   - **Widget Mode**: Managed (recommended)
   - **Theme**: Dark (to match your site)
5. Copy both keys:
   - **Site Key** (starts with `0x...`)
   - **Secret Key** (long alphanumeric string)

### Step 2: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...  # Your site key here
TURNSTILE_SECRET_KEY=0x4AAAAAAA...            # Your secret key here
```

⚠️ **Important**: 
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` must start with `NEXT_PUBLIC_` (accessible in browser)
- `TURNSTILE_SECRET_KEY` stays server-side only

### Step 3: Deploy

After adding the keys, restart your development server or deploy to production:

```bash
npm run dev
```

## 🧪 Testing

### Test legitimate submission:
1. Visit your contact page
2. Fill out the form completely
3. Wait for Turnstile to load (checkbox should appear)
4. Submit the form
5. Should succeed ✅

### Test spam detection:
1. **Fast submission**: Try submitting in under 2 seconds → Should fail
2. **Short message**: Type less than 20 characters → Should fail
3. **Too many links**: Include 3+ URLs in message → Should fail
4. **Spam keywords**: Use words like "casino", "viagra", "crypto" → Should fail
5. **Duplicate**: Submit same message twice → Second should fail
6. **Honeypot**: Open dev tools, unhide the "website" field, fill it → Silent fail
7. **No Turnstile**: Disable JavaScript or block Turnstile → Should fail

## 📊 Monitoring

Check your server logs for spam attempts. You'll see entries like:

```
🚫 Honeypot triggered: { email: 'bot@spam.com', ip: '1.2.3.4' }
🚫 Turnstile verification failed: { email: 'test@test.com', ip: '1.2.3.4' }
🚫 Spam detected: { email: 'test@test.com', reason: 'Too many links' }
🚫 Rate limit exceeded: { email: 'test@test.com', reason: 'Rate limit exceeded' }
✅ Contact form submission processed: { email: 'real@user.com', country: 'US' }
```

## 🌍 Country Blocking (Optional)

The code includes optional country-based blocking. Currently it's set to **log only**.

To enable strict US-only blocking, uncomment this section in `src/app/api/contact/route.ts`:

```typescript
// Around line 170-177
if (country !== 'US' && country !== 'unknown') {
  console.log('🚫 Non-US submission blocked:', { email, ip: clientIp, country });
  return NextResponse.json(
    { error: 'Service only available in the United States at this time.' },
    { status: 403 }
  );
}
```

⚠️ **Warning**: This will block ALL non-US IPs, including:
- VPN users
- Travelers abroad
- Expats
- Legitimate international interest

**Recommended**: Keep it on log-only mode and monitor patterns before enabling strict blocking.

## 🔧 Customization

### Adjust Rate Limits

In `src/app/api/contact/route.ts`, modify these values:

```typescript
// Line ~130-135
// Max 3 submissions per hour
if (tracker.count >= 3 && now - tracker.lastSubmission < 3600000) {
  // Change 3 to your desired limit
  // Change 3600000 (1 hour) to your desired window
}

// Min 30 seconds between submissions
if (now - tracker.lastSubmission < 30000) {
  // Change 30000 (30 seconds) to your desired minimum
}
```

### Add More Spam Keywords

In `src/app/api/contact/route.ts`, add to the array:

```typescript
// Line ~5-10
const SPAM_KEYWORDS = [
  'seo', 'casino', 'viagra', 'cialis', 'crypto', 'bitcoin', 
  // Add your own keywords here
  'payday loan', 'weight loss pills', etc.
];
```

### Adjust Message Length

```typescript
// Line ~63
if (message.length < 20) {
  // Change 20 to your desired minimum
}
```

### Adjust Timing Check

```typescript
// Line ~105 in route.ts
if (submissionTime && submissionTime < 2000) {
  // Change 2000 (2 seconds) to your desired minimum
}
```

## 🚨 Troubleshooting

### Turnstile not loading
- Check that `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set correctly
- Verify the key starts with `0x`
- Check browser console for errors
- Ensure domain matches the one registered with Cloudflare

### All submissions failing
- Check that `TURNSTILE_SECRET_KEY` is set in `.env.local`
- Verify the secret key is correct
- Check server logs for verification errors

### False positives (legitimate users blocked)
- Lower the spam keyword sensitivity
- Increase the minimum message length threshold
- Adjust rate limits
- Review server logs to identify patterns

## 📈 Production Recommendations

1. **Use Redis for rate limiting**: The current in-memory solution resets on server restart. For production, use Redis or similar.

2. **Monitor logs**: Set up log aggregation (Datadog, LogRocket, etc.) to track spam patterns.

3. **Adjust thresholds**: After monitoring for a week, adjust spam detection based on false positives/negatives.

4. **Enable country blocking cautiously**: Only if you see overwhelming spam from specific regions.

5. **Update spam keywords regularly**: As spammers evolve, update your keyword list.

## ✅ Checklist

- [ ] Created Cloudflare Turnstile widget
- [ ] Added `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to `.env.local`
- [ ] Added `TURNSTILE_SECRET_KEY` to `.env.local`
- [ ] Restarted development server
- [ ] Tested legitimate submission (works)
- [ ] Tested spam detection (blocks properly)
- [ ] Monitored logs for patterns
- [ ] Adjusted thresholds if needed
- [ ] Deployed to production
- [ ] Added keys to production environment variables

---

**Questions?** Check the logs or test each protection layer individually to identify issues.
