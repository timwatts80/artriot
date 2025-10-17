// Check SendGrid API key permissions and account status
require('dotenv').config({ path: './.env.local' });

async function checkApiKeyPermissions() {
  console.log('🔍 Checking SendGrid API key permissions and account status...\n');
  
  try {
    // Check what permissions our API key actually has
    console.log('🔑 Testing API key permissions...');
    
    const permissionTests = [
      {
        name: 'Mail Send',
        test: async () => {
          const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: 'test@example.com' }], subject: 'Test' }],
              from: { email: 'tim@onemorelight.cc' },
              content: [{ type: 'text/plain', value: 'Test' }]
            }),
          });
          return { status: response.status, ok: response.ok };
        }
      },
      {
        name: 'Marketing Lists Read',
        test: async () => {
          const response = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
            headers: {
              'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json',
            },
          });
          return { status: response.status, ok: response.ok };
        }
      },
      {
        name: 'Marketing Contacts Read',
        test: async () => {
          const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
            headers: {
              'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json',
            },
          });
          return { status: response.status, ok: response.ok };
        }
      },
      {
        name: 'Marketing Contacts Write',
        test: async () => {
          const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contacts: [{
                email: 'permission-test@example.com'
              }]
            }),
          });
          return { status: response.status, ok: response.ok };
        }
      }
    ];

    for (const test of permissionTests) {
      try {
        const result = await test.test();
        console.log(`${result.ok ? '✅' : '❌'} ${test.name}: ${result.status}`);
      } catch (error) {
        console.log(`❌ ${test.name}: Error - ${error.message}`);
      }
    }

    // Check account info if possible
    console.log('\n👤 Checking account information...');
    try {
      const profileResponse = await fetch('https://api.sendgrid.com/v3/user/profile', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        console.log('✅ Account accessible');
        console.log(`   Email: ${profile.email}`);
        console.log(`   Username: ${profile.username}`);
      } else {
        console.log(`❌ Account info: ${profileResponse.status}`);
      }
    } catch (error) {
      console.log('❌ Account info error:', error.message);
    }

    // Check if there are any account limits
    console.log('\n📊 Checking potential issues...');
    
    // Try a minimal contact creation to see exact error
    console.log('\n🧪 Testing minimal contact creation...');
    const minimalTest = {
      contacts: [{
        email: 'minimal-test@example.com'
      }]
    };

    const minimalResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalTest),
    });

    console.log(`Minimal test status: ${minimalResponse.status} ${minimalResponse.statusText}`);
    
    if (minimalResponse.ok) {
      const result = await minimalResponse.json();
      console.log('✅ Minimal test result:', JSON.stringify(result, null, 2));
    } else {
      const error = await minimalResponse.text();
      console.log('❌ Minimal test error:', error);
    }

  } catch (error) {
    console.error('❌ Permission check error:', error.message);
  }
}

checkApiKeyPermissions();