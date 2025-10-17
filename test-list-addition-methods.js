// Test different approaches to add contacts to lists
require('dotenv').config({ path: './.env.local' });

async function testListAdditionMethods() {
  console.log('🧪 Testing different list addition methods...\n');
  
  try {
    const newsletterListId = '85680db6-50b5-4b40-b9fc-e9b9dd6db906';
    
    // First, let's try the original method but get the contact ID first
    console.log('📤 Method 1: Get existing contact ID for tim@onemorelight.cc...');
    
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    let timContactId = null;
    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      const timContact = contactsData.result?.find(contact => 
        contact.email === 'tim@onemorelight.cc'
      );
      
      if (timContact) {
        timContactId = timContact.id;
        console.log(`✅ Found tim@onemorelight.cc with ID: ${timContactId}`);
      } else {
        console.log('❌ tim@onemorelight.cc not found');
        return;
      }
    }

    // Method 2: Try to add existing contact to list with list_ids in the contact update
    console.log('\n📤 Method 2: Update contact with list_ids...');
    
    const updateContactData = {
      contacts: [{
        id: timContactId,
        email: 'tim@onemorelight.cc',
        list_ids: [newsletterListId],
        custom_fields: {
          'e1_T': 'newsletter', // subscription_type
          'w2_D': new Date().toISOString().split('T')[0], // signup_date
          'w3_T': 'Newsletter Signup' // source
        }
      }]
    };

    const updateResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateContactData),
    });

    console.log(`Response: ${updateResponse.status} ${updateResponse.statusText}`);
    
    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log('✅ Update result:', JSON.stringify(result, null, 2));
    } else {
      const error = await updateResponse.text();
      console.log('❌ Error:', error);
    }

    // Wait and check result
    setTimeout(async () => {
      console.log('\n🔍 Checking if tim@onemorelight.cc is now in newsletter list...');
      
      const checkResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (checkResponse.ok) {
        const contactsData = await checkResponse.json();
        const timContact = contactsData.result?.find(contact => 
          contact.email === 'tim@onemorelight.cc'
        );
        
        if (timContact) {
          console.log('✅ Updated contact state:');
          console.log(`   Email: ${timContact.email}`);
          console.log(`   Lists: ${JSON.stringify(timContact.list_ids)}`);
          console.log(`   Custom fields: ${JSON.stringify(timContact.custom_fields)}`);
          
          // Check if it's in the newsletter list
          if (timContact.list_ids && timContact.list_ids.includes(newsletterListId)) {
            console.log('🎉 SUCCESS: tim@onemorelight.cc is now in the newsletter list!');
          } else {
            console.log('❌ FAILED: tim@onemorelight.cc is still not in the newsletter list');
          }
        }
      }
    }, 3000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testListAdditionMethods();