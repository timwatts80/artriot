# SendGrid Email Automation Setup Guide

## 🚀 Free Alternative to Kit.com

This setup gives you professional email automation without monthly fees - you only pay for emails sent (SendGrid's free tier includes 100 emails/day forever).

## 📧 SendGrid Setup (5 minutes)

### Step 1: Create SendGrid Account
1. Go to [SendGrid.com](https://sendgrid.com) and sign up (free forever plan)
2. Verify your email address
3. Complete the setup wizard

### Step 2: Verify Your Sender Email
1. In SendGrid dashboard → **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain** (recommended) or **Single Sender Verification**
3. For Single Sender: Enter `hello@artriot.com` (or your preferred email)
4. Check your email and click the verification link

### Step 3: Generate API Key
1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it "ArtRiot Website" 
4. Choose **Restricted Access** and enable:
   - Mail Send (Full Access)
5. Copy the API key (you'll need this for .env file)

## 🔧 Website Configuration

### Step 4: Environment Variables
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your details:
   ```env
   SENDGRID_API_KEY=SG.your_actual_api_key_here
   SENDGRID_FROM_EMAIL=hello@artriot.com
   GOOGLE_MEET_LINK=https://meet.google.com/your-actual-meeting-link
   ADMIN_EMAIL=your-admin-email@example.com
   ```

### Step 5: Update Google Meet Link
In `/src/app/api/register-meditation/route.ts`, find this line:
```html
<a href="https://meet.google.com/your-meeting-link" class="meet-link">
```
Replace with your actual Google Meet link.

## 🎯 How It Works

### Registration Flow:
1. **User fills form** → Name + Email submitted
2. **API processes registration** → Validates data
3. **SendGrid sends email** → Instant confirmation with Google Meet link
4. **Admin notification** → You get notified of new registrations

### Email Features:
- ✅ **Professional HTML email** with ArtRiot branding
- ✅ **Google Meet link** prominently displayed
- ✅ **Event details** and preparation instructions
- ✅ **Mobile responsive** design
- ✅ **Admin notifications** for each registration

## 💰 Cost Comparison

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| **SendGrid** | 100 emails/day forever | $0.0006 per email |
| Kit.com | Very limited | $29/month |
| Mailchimp | 500 contacts | $13/month |
| **Your Solution** | **100 emails/day FREE** | **Pay per use** |

## 🔄 Future Email Sequences

Want to add follow-up emails? Easy! You can:

1. **Save registrations to database** (add to the API)
2. **Set up cron jobs** to send follow-ups
3. **Use SendGrid templates** for different email types
4. **Add unsubscribe links** (required for marketing emails)

## 🚀 Going Live

### Testing:
```bash
npm run dev
# Test registration form at /register/art-meditation
```

### Production:
1. Deploy to Vercel/Netlify
2. Add environment variables to hosting platform
3. Update NEXTAUTH_URL to your domain
4. Test with real email addresses

## 📊 Tracking & Analytics

### Built-in Tracking:
- SendGrid provides delivery, open, and click tracking
- Console logs for debugging registration issues
- Admin email notifications for each sign-up

### Optional Enhancements:
- Add Google Analytics events
- Store registrations in a database
- Create a dashboard to view all registrations

## 🛡️ Security & Privacy

- ✅ Input validation and sanitization
- ✅ Email format verification
- ✅ Rate limiting (built into Next.js API routes)
- ✅ Environment variables for secrets
- ✅ No personal data stored (unless you add database)

## 🆘 Troubleshooting

### Common Issues:

**"SendGrid API error"**
- Check API key is correct in .env.local
- Verify sender email is authenticated
- Check SendGrid account status

**"Registration failed"**
- Check browser console for errors
- Verify all environment variables are set
- Test API endpoint directly

**Emails not received**
- Check spam folder
- Verify sender authentication in SendGrid
- Test with different email providers

## 📞 Support

Need help? The setup is designed to be simple, but if you run into issues:
1. Check the browser console for error messages
2. Verify all environment variables are correctly set
3. Test the SendGrid API key in their dashboard first

This solution gives you professional email automation for free (up to 100 emails/day) and scales affordably as you grow!