// Investigate why tim@onemorelight.cc specifically fails
require('dotenv').config({ path: './.env.local' });

async function investigateTimEmail() {
  console.log('🔍 Investigating why tim@onemorelight.cc specifically fails...\n');
  
  try {
    // 1. Check if this email is somehow blocked or on a suppression list
    console.log('📋 Checking SendGrid suppression lists...');
    
    const suppressionChecks = [
      { name: 'blocks', endpoint: 'https://api.sendgrid.com/v3/suppression/blocks' },
      { name: 'bounces', endpoint: 'https://api.sendgrid.com/v3/suppression/bounces' },
      { name: 'spam_reports', endpoint: 'https://api.sendgrid.com/v3/suppression/spam_reports' },
      { name: 'unsubscribes', endpoint: 'https://api.sendgrid.com/v3/suppression/unsubscribes' }
    ];

    for (const check of suppressionChecks) {
      try {
        const response = await fetch(`${check.endpoint}?email=tim@onemorelight.cc`, {
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            console.log(`❌ FOUND in ${check.name}:`, JSON.stringify(data, null, 2));
          } else {
            console.log(`✅ Not in ${check.name}`);
          }
        } else {
          console.log(`⚠️  Could not check ${check.name}: ${response.status}`);
        }
      } catch (error) {
        console.log(`⚠️  Error checking ${check.name}: ${error.message}`);
      }
    }

    // 2. Test with a similar but different email to see if it's domain-specific
    console.log('\n🧪 Testing with similar email to isolate the issue...');
    
    const testEmail = 'tim-test@onemorelight.cc';
    console.log(`📧 Testing with: ${testEmail}`);
    
    const testContactData = {
      contacts: [{
        email: testEmail,
        custom_fields: {
          'subscription_type': 'newsletter',
          'signup_date': new Date().toISOString().split('T')[0],
          'source': 'Debug Test'
        }
      }]
    };

    const testResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testContactData),
    });

    if (testResponse.ok) {
      const result = await testResponse.json();
      console.log(`✅ Test email job submitted: ${result.job_id}`);
    } else {
      const error = await testResponse.text();
      console.log(`❌ Test email failed: ${error}`);
    }

    // 3. Check if there are any validation issues with the email
    console.log('\n📧 Email validation check...');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test('tim@onemorelight.cc');
    console.log(`Email format valid: ${isValidFormat ? '✅' : '❌'}`);

    // 4. Check if the domain has any issues
    console.log('\n🌐 Domain check...');
    const domain = 'onemorelight.cc';
    console.log(`Domain: ${domain}`);
    
    // Try a simple domain validation
    try {
      const dnsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      if (dnsResponse.ok) {
        const dnsData = await dnsResponse.json();
        console.log(`MX records exist: ${dnsData.Answer ? '✅' : '❌'}`);
      }
    } catch (error) {
      console.log('Could not check MX records');
    }

    // 5. Test the exact API call that should work
    console.log('\n🔧 Testing exact API call for tim@onemorelight.cc...');
    
    const exactContactData = {
      contacts: [{
        email: 'tim@onemorelight.cc',
        custom_fields: {
          'subscription_type': 'newsletter-debug',
          'signup_date': new Date().toISOString().split('T')[0],
          'source': 'Manual Debug Test'
        }
      }]
    };

    console.log('Sending exact contact data:');
    console.log(JSON.stringify(exactContactData, null, 2));

    const exactResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exactContactData),
    });

    console.log(`Response status: ${exactResponse.status} ${exactResponse.statusText}`);
    
    if (exactResponse.ok) {
      const result = await exactResponse.json();
      console.log('✅ Response:', JSON.stringify(result, null, 2));
    } else {
      const error = await exactResponse.text();
      console.log('❌ Error response:', error);
    }

  } catch (error) {
    console.error('❌ Investigation error:', error.message);
  }
}

investigateTimEmail();