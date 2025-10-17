// Test the corrected newsletter signup with a fresh email
require('dotenv').config({ path: './.env.local' });

async function testCorrectNewsletterFlow() {
  console.log('🧪 Testing corrected newsletter flow with fresh email...\n');
  
  const testEmail = `newsletter-final-test-${Date.now()}@example.com`;
  console.log(`📧 Testing with: ${testEmail}`);
  
  try {
    // Test the newsletter signup API
    const response = await fetch('http://localhost:3000/api/newsletter-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Newsletter signup successful:', result);
      
      // Wait and check if contact appears in newsletter list
      console.log('\n⏰ Waiting 45 seconds for SendGrid processing...');
      
      setTimeout(async () => {
        console.log('\n🔍 Checking if contact was added to newsletter list...');
        
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
            console.log('✅ Test contact found:');
            console.log(`   Email: ${testContact.email}`);
            console.log(`   Lists: ${JSON.stringify(testContact.list_ids)}`);
            console.log(`   Custom Fields: ${JSON.stringify(testContact.custom_fields)}`);
            
            const newsletterListId = '85680db6-50b5-4b40-b9fc-e9b9dd6db906';
            if (testContact.list_ids && testContact.list_ids.includes(newsletterListId)) {
              console.log('🎉 SUCCESS: Contact is in ArtRiot Newsletter list!');
            } else {
              console.log('❌ Contact not in newsletter list yet');
            }
            
            if (testContact.custom_fields && Object.keys(testContact.custom_fields).length > 0) {
              console.log('✅ Custom fields populated correctly!');
            } else {
              console.log('❌ Custom fields still empty');
            }
            
          } else {
            console.log('❌ Test contact not found yet');
          }
          
          // Also check newsletter list count
          const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
            headers: {
              'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json',
            },
          });

          if (listsResponse.ok) {
            const listsData = await listsResponse.json();
            const newsletterList = listsData.result?.find(list => list.name === 'ArtRiot Newsletter');
            console.log(`\n📊 ArtRiot Newsletter list now has: ${newsletterList?.contact_count || 0} contacts`);
          }
        }
      }, 45000); // Wait 45 seconds
      
    } else {
      const error = await response.text();
      console.log('❌ Newsletter signup failed:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCorrectNewsletterFlow();