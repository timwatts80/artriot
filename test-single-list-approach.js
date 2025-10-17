// Test both newsletter and meditation registration with single list approach
require('dotenv').config({ path: './.env.local' });

async function testSingleListApproach() {
  console.log('🧪 Testing single list approach (both endpoints use Art Riot list)...\n');
  
  const baseUrl = 'http://localhost:3001'; // Server is on 3001
  
  try {
    // Test 1: Newsletter signup
    console.log('1️⃣ Testing newsletter signup...');
    const newsletterEmail = `single-newsletter-${Date.now()}@example.com`;
    
    const newsletterResponse = await fetch(`${baseUrl}/api/newsletter-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: newsletterEmail
      }),
    });

    if (newsletterResponse.ok) {
      const result = await newsletterResponse.json();
      console.log(`✅ Newsletter signup successful: ${result.message}`);
    } else {
      const error = await newsletterResponse.text();
      console.log(`❌ Newsletter signup failed: ${error}`);
    }

    // Wait a moment between tests
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Art Meditation registration
    console.log('\n2️⃣ Testing Art Meditation registration...');
    const meditationEmail = `single-meditation-${Date.now()}@example.com`;
    const meditationName = 'Test User';
    
    const meditationResponse = await fetch(`${baseUrl}/api/register-meditation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: meditationName,
        email: meditationEmail
      }),
    });

    if (meditationResponse.ok) {
      const result = await meditationResponse.json();
      console.log(`✅ Meditation registration successful: ${result.message}`);
    } else {
      const error = await meditationResponse.text();
      console.log(`❌ Meditation registration failed: ${error}`);
    }

    // Wait and check if contacts appear in the Art Riot list
    console.log('\n⏰ Waiting 30 seconds to check contact creation...');
    
    setTimeout(async () => {
      console.log('\n🔍 Checking if contacts were added to Art Riot list...');
      
      const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        
        // Check for our test contacts
        const newsletterContact = contactsData.result?.find(contact => 
          contact.email === newsletterEmail
        );
        const meditationContact = contactsData.result?.find(contact => 
          contact.email === meditationEmail
        );
        
        console.log(`📧 Newsletter contact (${newsletterEmail}): ${newsletterContact ? '✅ FOUND' : '❌ Missing'}`);
        if (newsletterContact) {
          console.log(`   Lists: ${JSON.stringify(newsletterContact.list_ids)}`);
          console.log(`   Custom Fields: ${JSON.stringify(newsletterContact.custom_fields)}`);
        }
        
        console.log(`📧 Meditation contact (${meditationEmail}): ${meditationContact ? '✅ FOUND' : '❌ Missing'}`);
        if (meditationContact) {
          console.log(`   Lists: ${JSON.stringify(meditationContact.list_ids)}`);
          console.log(`   Custom Fields: ${JSON.stringify(meditationContact.custom_fields)}`);
        }
        
        // Check Art Riot list count
        const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (listsResponse.ok) {
          const listsData = await listsResponse.json();
          const artRiotList = listsData.result?.find(list => list.name === 'Art Riot');
          console.log(`\n📊 Art Riot list now has: ${artRiotList?.contact_count || 0} contacts`);
        }
      }
    }, 30000); // Check after 30 seconds

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testSingleListApproach();