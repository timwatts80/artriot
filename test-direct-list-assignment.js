// Test direct list assignment with existing contacts
require('dotenv').config({ path: './.env.local' });

async function testDirectListAssignment() {
  console.log('🧪 Testing direct list assignment...\n');
  
  try {
    const newsletterListId = '85680db6-50b5-4b40-b9fc-e9b9dd6db906';
    
    // Try to add custom-field-test-1760715402328@example.com to newsletter list
    // This contact already has proper custom fields
    const testEmail = 'custom-field-test-1760715402328@example.com';
    
    console.log(`📧 Testing with: ${testEmail}`);
    console.log(`📋 Target list: ArtRiot Newsletter (${newsletterListId})`);
    
    // Method 1: Try using contact email with list_ids
    console.log('\n📤 Method 1: Using email with list_ids...');
    
    const method1Data = {
      contacts: [{
        email: testEmail,
        list_ids: [newsletterListId]
      }]
    };

    console.log('Method 1 data:', JSON.stringify(method1Data, null, 2));

    const method1Response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(method1Data),
    });

    if (method1Response.ok) {
      const result = await method1Response.json();
      console.log(`✅ Method 1 job: ${result.job_id}`);
    } else {
      const error = await method1Response.text();
      console.log('❌ Method 1 failed:', error);
    }

    // Method 2: Try using contact ID (need to get it first)
    console.log('\n📤 Method 2: Using contact ID...');
    
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      const testContact = contactsData.result?.find(contact => 
        contact.email === testEmail
      );
      
      if (testContact) {
        console.log(`Found contact ID: ${testContact.id}`);
        
        const method2Data = {
          contacts: [{
            id: testContact.id,
            list_ids: [newsletterListId]
          }]
        };

        console.log('Method 2 data:', JSON.stringify(method2Data, null, 2));

        const method2Response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(method2Data),
        });

        if (method2Response.ok) {
          const result = await method2Response.json();
          console.log(`✅ Method 2 job: ${result.job_id}`);
        } else {
          const error = await method2Response.text();
          console.log('❌ Method 2 failed:', error);
        }
      } else {
        console.log('❌ Test contact not found');
      }
    }

    // Method 3: Try the top-level list_ids approach (original approach)
    console.log('\n📤 Method 3: Using top-level list_ids...');
    
    const method3Data = {
      list_ids: [newsletterListId],
      contacts: [{
        email: testEmail
      }]
    };

    console.log('Method 3 data:', JSON.stringify(method3Data, null, 2));

    const method3Response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(method3Data),
    });

    if (method3Response.ok) {
      const result = await method3Response.json();
      console.log(`✅ Method 3 job: ${result.job_id}`);
    } else {
      const error = await method3Response.text();
      console.log('❌ Method 3 failed:', error);
    }

    // Wait and check results
    setTimeout(async () => {
      console.log('\n🔍 Checking results after 15 seconds...');
      
      const checkResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (checkResponse.ok) {
        const contactsData = await checkResponse.json();
        const contact = contactsData.result?.find(c => c.email === testEmail);
        
        if (contact) {
          console.log(`📧 ${testEmail}:`);
          console.log(`   Lists: ${JSON.stringify(contact.list_ids)}`);
          console.log(`   Updated: ${contact.updated_at}`);
          
          if (contact.list_ids && contact.list_ids.includes(newsletterListId)) {
            console.log('🎉 SUCCESS: Contact was added to newsletter list!');
          } else {
            console.log('❌ FAILED: Contact still not in newsletter list');
          }
        }
      }
    }, 15000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDirectListAssignment();