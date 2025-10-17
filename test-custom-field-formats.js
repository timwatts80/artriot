// Test different custom field formats and approaches
require('dotenv').config({ path: './.env.local' });

async function testCustomFieldFormats() {
  console.log('🧪 Testing different custom field formats...\n');
  
  try {
    // Test 1: Try with a fresh contact and different date format
    console.log('📤 Test 1: Fresh contact with ISO date format...');
    
    const testEmail1 = `custom-field-test-${Date.now()}@example.com`;
    
    const test1Data = {
      contacts: [{
        email: testEmail1,
        custom_fields: {
          'e1_T': 'newsletter',
          'w2_D': new Date().toISOString(), // Full ISO format
          'w3_T': 'Newsletter Signup'
        }
      }]
    };

    console.log('Test 1 data:', JSON.stringify(test1Data, null, 2));

    const test1Response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(test1Data),
    });

    if (test1Response.ok) {
      const result = await test1Response.json();
      console.log(`✅ Test 1 job: ${result.job_id}`);
    } else {
      const error = await test1Response.text();
      console.log('❌ Test 1 failed:', error);
    }

    // Test 2: Try with just text fields (no date)
    console.log('\n📤 Test 2: Only text fields, no date...');
    
    const testEmail2 = `text-only-test-${Date.now()}@example.com`;
    
    const test2Data = {
      contacts: [{
        email: testEmail2,
        custom_fields: {
          'e1_T': 'newsletter',
          'w3_T': 'Newsletter Signup'
        }
      }]
    };

    console.log('Test 2 data:', JSON.stringify(test2Data, null, 2));

    const test2Response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(test2Data),
    });

    if (test2Response.ok) {
      const result = await test2Response.json();
      console.log(`✅ Test 2 job: ${result.job_id}`);
    } else {
      const error = await test2Response.text();
      console.log('❌ Test 2 failed:', error);
    }

    // Test 3: Try using field names instead of IDs
    console.log('\n📤 Test 3: Using field names instead of IDs...');
    
    const testEmail3 = `field-name-test-${Date.now()}@example.com`;
    
    const test3Data = {
      contacts: [{
        email: testEmail3,
        custom_fields: {
          'subscription_type': 'newsletter',
          'signup_date': '2025-10-17',
          'source': 'Newsletter Signup'
        }
      }]
    };

    console.log('Test 3 data:', JSON.stringify(test3Data, null, 2));

    const test3Response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(test3Data),
    });

    if (test3Response.ok) {
      const result = await test3Response.json();
      console.log(`✅ Test 3 job: ${result.job_id}`);
    } else {
      const error = await test3Response.text();
      console.log('❌ Test 3 failed:', error);
    }

    // Wait and check all test results
    setTimeout(async () => {
      console.log('\n🔍 Checking test results after 15 seconds...');
      
      const checkResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (checkResponse.ok) {
        const contactsData = await checkResponse.json();
        
        // Check each test contact
        [testEmail1, testEmail2, testEmail3].forEach(email => {
          const contact = contactsData.result?.find(c => c.email === email);
          if (contact) {
            console.log(`\n📧 ${email}:`);
            console.log(`   Custom Fields: ${JSON.stringify(contact.custom_fields)}`);
            console.log(`   Created: ${contact.created_at}`);
          } else {
            console.log(`\n❌ ${email}: Not found`);
          }
        });
      }
    }, 15000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCustomFieldFormats();