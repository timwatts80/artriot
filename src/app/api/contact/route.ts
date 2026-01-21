import { NextRequest, NextResponse } from 'next/server';

// Rate limiting storage (in-memory, use Redis for production)
const submissionTracker = new Map<string, { count: number; lastSubmission: number; messages: string[] }>();

// Spam keywords to check for
const SPAM_KEYWORDS = [
  'seo', 'casino', 'viagra', 'cialis', 'crypto', 'bitcoin', 
  'forex', 'loan', 'crypto', 'investment opportunity', 'make money fast',
  'click here', 'buy now', 'limited time', 'act now', 'weight loss',
  'free money', 'guarantee', 'no risk', 'miracle'
];

// Function to verify Cloudflare Turnstile token
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.warn('Turnstile secret key not configured');
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// Function to check for spam patterns
function detectSpam(message: string, name: string, subject: string): { isSpam: boolean; reason: string } {
  // Check for gibberish/random characters
  const gibberishCheck = detectGibberish(message);
  if (gibberishCheck.isGibberish) {
    return { isSpam: true, reason: gibberishCheck.reason };
  }

  // Check for excessive links
  const linkPattern = /(https?:\/\/[^\s]+)/gi;
  const links = message.match(linkPattern) || [];
  if (links.length > 2) {
    return { isSpam: true, reason: 'Too many links' };
  }

  // Check for spam keywords
  const combinedText = `${message} ${name} ${subject}`.toLowerCase();
  for (const keyword of SPAM_KEYWORDS) {
    if (combinedText.includes(keyword.toLowerCase())) {
      return { isSpam: true, reason: `Spam keyword detected: ${keyword}` };
    }
  }

  // Check for excessive repetition
  const words = message.toLowerCase().split(/\s+/);
  const wordCount = new Map<string, number>();
  for (const word of words) {
    if (word.length > 3) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
  }
  
  for (const [word, count] of wordCount.entries()) {
    if (count > 5) {
      return { isSpam: true, reason: 'Excessive word repetition' };
    }
  }

  return { isSpam: false, reason: '' };
}

// Function to detect gibberish/random character strings
function detectGibberish(text: string): { isGibberish: boolean; reason: string } {
  // Remove common punctuation and trim
  const cleanText = text.replace(/[.,!?;:'"]/g, ' ').trim();
  
  // Check 1: Messages longer than 15 chars should have at least one space (words)
  if (cleanText.length > 15 && !cleanText.includes(' ')) {
    return { isGibberish: true, reason: 'No spaces detected - appears to be random characters' };
  }

  // Check 2: Check for consecutive consonants (more than 5 in a row is suspicious)
  const consonantPattern = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{6,}/;
  if (consonantPattern.test(cleanText)) {
    return { isGibberish: true, reason: 'Excessive consecutive consonants detected' };
  }

  // Check 3: Check vowel ratio (real text has 35-50% vowels typically)
  const vowels = cleanText.match(/[aeiouAEIOU]/g) || [];
  const letters = cleanText.match(/[a-zA-Z]/g) || [];
  if (letters.length > 10) {
    const vowelRatio = vowels.length / letters.length;
    if (vowelRatio < 0.15) {
      return { isGibberish: true, reason: 'Insufficient vowels - appears to be random characters' };
    }
  }

  // Check 4: Check for case alternation patterns (LiKe ThIs)
  const caseChanges = cleanText.match(/[a-z][A-Z]|[A-Z][a-z][A-Z]/g) || [];
  if (caseChanges.length > cleanText.length * 0.3) {
    return { isGibberish: true, reason: 'Unusual case alternation pattern detected' };
  }

  // Check 5: For longer messages, check if there are any recognizable 2-3 letter words
  if (cleanText.length > 30) {
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 
                         'was', 'one', 'our', 'out', 'has', 'his', 'how', 'its', 'may', 'see',
                         'use', 'way', 'who', 'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go',
                         'he', 'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or',
                         'so', 'to', 'up', 'us', 'we'];
    const lowerText = cleanText.toLowerCase();
    const hasCommonWord = commonWords.some(word => 
      new RegExp(`\\b${word}\\b`).test(lowerText)
    );
    if (!hasCommonWord) {
      return { isGibberish: true, reason: 'No recognizable common words found' };
    }
  }

  return { isGibberish: false, reason: '' };
}

// Function to check rate limiting and duplicate messages
function checkRateLimit(ip: string, message: string, email: string): { allowed: boolean; reason: string } {
  const now = Date.now();
  const key = `${ip}-${email}`;
  const tracker = submissionTracker.get(key);

  // Clean up old entries (older than 1 hour)
  for (const [k, v] of submissionTracker.entries()) {
    if (now - v.lastSubmission > 3600000) {
      submissionTracker.delete(k);
    }
  }

  if (tracker) {
    // Check for duplicate message
    if (tracker.messages.includes(message)) {
      return { allowed: false, reason: 'Duplicate message detected' };
    }

    // Rate limit: max 3 submissions per hour
    if (tracker.count >= 3 && now - tracker.lastSubmission < 3600000) {
      return { allowed: false, reason: 'Rate limit exceeded. Please try again later.' };
    }

    // Rate limit: min 30 seconds between submissions
    if (now - tracker.lastSubmission < 30000) {
      return { allowed: false, reason: 'Please wait before submitting again.' };
    }

    tracker.count++;
    tracker.lastSubmission = now;
    tracker.messages.push(message);
    if (tracker.messages.length > 10) {
      tracker.messages.shift(); // Keep only last 10 messages
    }
  } else {
    submissionTracker.set(key, {
      count: 1,
      lastSubmission: now,
      messages: [message]
    });
  }

  return { allowed: true, reason: '' };
}

// Function to get client IP
function getClientIp(request: NextRequest): string {
  // Try Cloudflare headers first
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  // Try standard headers
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  return 'unknown';
}

// Function to get country from Cloudflare headers
function getCountry(request: NextRequest): string {
  return request.headers.get('cf-ipcountry') || 'unknown';
}

// Function to send email via Brevo
async function sendBrevoEmail(to: string, subject: string, htmlContent: string, from: string = 'info@artriot.live') {
  if (!process.env.BREVO_API_KEY) {
    console.warn('Brevo API key not configured, skipping email');
    return;
  }

  try {
    const emailData = {
      sender: { email: from, name: 'Art Riot Live' },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      console.log('Email sent successfully via Brevo to:', to);
    } else {
      const errorData = await response.text();
      console.error('Brevo email error:', response.status, errorData);
    }
  } catch (error) {
    console.error('Failed to send email via Brevo:', error);
  }
}

// Function to add contact to Brevo list
async function addToBrevoList(email: string, firstName: string, lastName: string = '', confirmationNumber: string = '', phone: string = '') {
  if (!process.env.BREVO_API_KEY) {
    console.warn('Brevo API key not configured, skipping Brevo integration');
    return;
  }

  try {
    const contactData: {
      email: string;
      attributes: Record<string, string>;
      listIds: number[];
      updateEnabled: boolean;
      extId?: string;
    } = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName
      },
      listIds: [8], // Add to list ID #8
      updateEnabled: true // Update if contact already exists
    };

    // Add phone number if provided - format for international use
    if (phone) {
      // Format phone number for Brevo (remove any non-digits and add +1 if US number)
      let formattedPhone = phone.replace(/\D/g, ''); // Remove all non-digits
      if (formattedPhone.length === 10) {
        formattedPhone = '+1' + formattedPhone; // Add US country code if 10 digits
      } else if (formattedPhone.length === 11 && formattedPhone.startsWith('1')) {
        formattedPhone = '+' + formattedPhone; // Add + if 11 digits starting with 1
      }
      contactData.attributes.SMS = formattedPhone;
    }

    // Only add extId if confirmation number is provided
    if (confirmationNumber) {
      contactData.extId = confirmationNumber;
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (response.ok) {
      console.log('Contact added to Brevo list #8:', email, confirmationNumber ? `with confirmation: ${confirmationNumber}` : '(contact form)');
    } else {
      const errorData = await response.text();
      console.error('Brevo API error:', response.status, errorData);
    }
  } catch (error) {
    console.error('Failed to add contact to Brevo:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, turnstileToken, submissionTime, website } = body;

    // Get client IP and country
    const clientIp = getClientIp(request);
    const country = getCountry(request);

    // Log submission for monitoring
    console.log('Contact form submission:', {
      email,
      country,
      ip: clientIp,
      timestamp: new Date().toISOString()
    });

    // 1. HONEYPOT CHECK - Silent fail for bots
    if (website) {
      console.log('🚫 Honeypot triggered:', { email, ip: clientIp });
      return NextResponse.json(
        { message: 'Message sent successfully!' },
        { status: 200 }
      );
    }

    // 2. VALIDATE REQUIRED FIELDS
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 3. VALIDATE EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // 4. VERIFY TURNSTILE TOKEN
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Security verification required' },
        { status: 400 }
      );
    }

    // Skip Turnstile verification in development mode
    const isDevelopmentMode = turnstileToken === 'development-mode';
    
    if (!isDevelopmentMode) {
      const turnstileValid = await verifyTurnstile(turnstileToken, clientIp);
      if (!turnstileValid) {
        console.log('🚫 Turnstile verification failed:', { email, ip: clientIp });
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 403 }
        );
      }
    } else {
      console.log('⚠️  Development mode: Turnstile verification skipped');
    }

    // 5. CHECK SUBMISSION TIMING
    if (submissionTime && submissionTime < 2000) {
      console.log('🚫 Submission too fast:', { email, ip: clientIp, time: submissionTime });
      return NextResponse.json(
        { error: 'Please take your time filling out the form.' },
        { status: 429 }
      );
    }

    // 6. SPAM DETECTION
    const spamCheck = detectSpam(message, name, subject);
    if (spamCheck.isSpam) {
      console.log('🚫 Spam detected:', { email, ip: clientIp, reason: spamCheck.reason });
      return NextResponse.json(
        { error: 'Sorry. There was an error submitting your message.' },
        { status: 403 }
      );
    }

    // 7. RATE LIMITING
    const rateLimitCheck = checkRateLimit(clientIp, message, email);
    if (!rateLimitCheck.allowed) {
      console.log('🚫 Rate limit exceeded:', { email, ip: clientIp, reason: rateLimitCheck.reason });
      return NextResponse.json(
        { error: rateLimitCheck.reason },
        { status: 429 }
      );
    }

    // 8. COUNTRY RESTRICTION (Optional - Log but allow for now)
    // You can enable strict blocking by uncommenting below
    /*
    if (country !== 'US' && country !== 'unknown') {
      console.log('🚫 Non-US submission blocked:', { email, ip: clientIp, country });
      return NextResponse.json(
        { error: 'Service only available in the United States at this time.' },
        { status: 403 }
      );
    }
    */
    
    if (country !== 'US' && country !== 'unknown') {
      console.log('⚠️  Non-US submission (allowed):', { email, ip: clientIp, country });
    }

    // Check for Brevo API key
    if (!process.env.BREVO_API_KEY) {
      console.error('Brevo API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please try again later.' },
        { status: 500 }
      );
    }

    // Email to Art Riot (notification)
    const notificationEmailHTML = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #f11568; border-bottom: 2px solid #f11568; padding-bottom: 10px;">
    New Contact Form Submission
  </h2>
  
  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #333;">Contact Details:</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #f11568;">${email}</a></p>
    <p><strong>Subject:</strong> ${subject}</p>
  </div>
  
  <div style="margin: 20px 0;">
    <h3 style="color: #333;">Message:</h3>
    <div style="background: white; padding: 15px; border-left: 4px solid #f11568; border-radius: 4px;">
      ${message.replace(/\n/g, '<br>')}
    </div>
  </div>
  
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
  <p style="color: #666; font-size: 12px;">
    Sent from ArtRiot.live contact form on ${new Date().toLocaleDateString()}
  </p>
</div>
    `;

    // Confirmation email to submitter
    const confirmationEmailHTML = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #111; color: #fff;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #fff; margin: 0;">
      Art<span style="color: #f11568;">Riot</span>
    </h1>
  </div>
  
  <h2 style="color: #f11568; margin-bottom: 20px;">Thank you for contacting us!</h2>
  
  <p style="color: #ccc; line-height: 1.6;">Hi ${name},</p>
  
  <p style="color: #ccc; line-height: 1.6;">
    Thank you for reaching out to Art Riot! We've received your message about 
    <strong style="color: #fff;">"${subject}"</strong> and appreciate you taking the time to connect with us.
  </p>
  
  <p style="color: #ccc; line-height: 1.6;">
    We'll review your message and get back to you soon.
  </p>
  
  <div style="background: #222; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #f11568;">
    <h3 style="color: #fff; margin-top: 0;">In the meantime, feel free to:</h3>
    <ul style="color: #ccc; line-height: 1.8;">
      <li>Join our <a href="https://www.facebook.com/groups/artriot" style="color: #f11568; text-decoration: none;">Facebook community</a></li>
      <li>Explore our <a href="https://artriot.live/register/art-meditation" style="color: #f11568; text-decoration: none;">virtual events</a></li>
      <li>Learn about <a href="https://artriot.live/in-person-events" style="color: #f11568; text-decoration: none;">Art Riot Live sessions</a></li>
    </ul>
  </div>
  
  <p style="color: #ccc; line-height: 1.6; margin-top: 30px;">
    Keep creating,<br>
    <strong style="color: #fff;">The Art Riot Team</strong>
  </p>
  
  <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
  <p style="color: #666; font-size: 12px; text-align: center;">
    This is an automated confirmation. Please don't reply to this email.
  </p>
</div>
    `;

    // Send both emails via Brevo
    await Promise.all([
      sendBrevoEmail('info@artriot.live', `Contact Form: ${subject}`, notificationEmailHTML),
      sendBrevoEmail(email, 'Thank you for contacting Art Riot!', confirmationEmailHTML)
    ]);

    // Add contact to Brevo list #8
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '';
    await addToBrevoList(email, firstName, lastName);

    // Log successful submission
    console.log('✅ Contact form submission processed:', {
      name,
      email,
      subject,
      country,
      ip: clientIp,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        message: 'Message sent successfully! Check your email for confirmation.',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}