// Wait longer and check multiple times to see if it's a processing delay
require('dotenv').config({ path: './.env.local' });

async function waitAndCheckMultipleTimes() {
  console.log('⏰ Testing with longer waits to see if it\'s a processing delay...\n');
  
  try {
    // Create another simple test contact
    const testEmail = `delay-test-${Date.now()}@example.com`;
    console.log(`📧 Creating test contact: ${testEmail}`);

    const contactData = {
      contacts: [{
        email: testEmail
      }]
    };

    const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Request accepted, job ID: ${result.job_id}`);
      
      // Check every 10 seconds for 2 minutes
      let attempts = 0;
      const maxAttempts = 12; // 2 minutes
      
      const checkInterval = setInterval(async () => {
        attempts++;
        console.log(`\n🔍 Check #${attempts} (${attempts * 10} seconds elapsed)...`);
        
        try {
          const checkResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
            headers: {
              'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
              'Content-Type': 'application/json',
            },
          });

          if (checkResponse.ok) {
            const contactsData = await checkResponse.json();
            const testContact = contactsData.result?.find(contact => 
              contact.email === testEmail
            );
            
            if (testContact) {
              console.log('🎉 SUCCESS: Contact found!');
              console.log(`   Email: ${testContact.email}`);
              console.log(`   Created: ${testContact.created_at}`);
              console.log(`   Lists: ${JSON.stringify(testContact.list_ids)}`);
              clearInterval(checkInterval);
              
              // Now test adding it to a list
              console.log('\n📤 Now testing list assignment...');
              await testListAssignment(testContact.id);
              
            } else {
              console.log(`❌ Contact not found yet (attempt ${attempts}/${maxAttempts})`);
              
              if (attempts >= maxAttempts) {
                console.log('\n💔 Contact never appeared after 2 minutes');
                console.log('This suggests a SendGrid account or API issue');
                clearInterval(checkInterval);
              }
            }
          }
        } catch (error) {
          console.error(`Error in check #${attempts}:`, error.message);
        }
      }, 10000); // Check every 10 seconds

    } else {
      const error = await response.text();
      console.log('❌ Initial request failed:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testListAssignment(contactId) {
  const newsletterListId = '85680db6-50b5-4b40-b9fc-e9b9dd6db906';
  
  try {
    console.log(`📋 Adding contact ${contactId} to newsletter list...`);
    
    const updateData = {
      contacts: [{
        id: contactId,
        list_ids: [newsletterListId]
      }]
    };

    const updateResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log(`✅ List assignment job ID: ${result.job_id}`);
      
      // Check if list assignment worked after 30 seconds
      setTimeout(async () => {
        console.log('\n🔍 Checking list assignment result...');
        
        const checkResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (checkResponse.ok) {
          const contactsData = await checkResponse.json();
          const contact = contactsData.result?.find(c => c.id === contactId);
          
          if (contact) {
            console.log('📋 Final contact state:');
            console.log(`   Lists: ${JSON.stringify(contact.list_ids)}`);
            
            if (contact.list_ids && contact.list_ids.includes(newsletterListId)) {
              console.log('🎉 SUCCESS: Contact was added to newsletter list!');
            } else {
              console.log('❌ FAILED: Contact still not in newsletter list');
            }
          }
        }
      }, 30000); // Wait 30 seconds for list assignment
      
    } else {
      const error = await updateResponse.text();
      console.log('❌ List assignment failed:', error);
    }

  } catch (error) {
    console.error('❌ List assignment error:', error.message);
  }
}

waitAndCheckMultipleTimes();