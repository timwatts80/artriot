// Test the correct way to add contacts to lists in SendGrid
require('dotenv').config({ path: './.env.local' });

async function testCorrectListAddition() {
  console.log('🧪 Testing correct list addition method...\n');
  
  try {
    const newsletterListId = '85680db6-50b5-4b40-b9fc-e9b9dd6db906';
    
    // Method 1: Create/update contact first WITHOUT list_ids
    console.log('📤 Step 1: Creating/updating contact without list assignment...');
    
    const contactData = {
      contacts: [{
        email: 'test2@example.com',
        custom_fields: {
          'e1_T': 'newsletter', // subscription_type
          'w2_D': new Date().toISOString().split('T')[0], // signup_date
          'w3_T': 'Newsletter Signup' // source
        }
      }]
    };

    const createResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    console.log(`Response: ${createResponse.status} ${createResponse.statusText}`);
    
    if (createResponse.ok) {
      const result = await createResponse.json();
      console.log('✅ Contact created:', JSON.stringify(result, null, 2));
    } else {
      const error = await createResponse.text();
      console.log('❌ Error:', error);
      return;
    }

    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Method 2: Add contact to list using the lists endpoint
    console.log('\n📤 Step 2: Adding contact to newsletter list...');
    
    const addToListData = {
      contact_ids: ['test2@example.com'] // Can use email as ID
    };

    const addToListResponse = await fetch(`https://api.sendgrid.com/v3/marketing/lists/${newsletterListId}/contacts`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addToListData),
    });

    console.log(`Response: ${addToListResponse.status} ${addToListResponse.statusText}`);
    
    if (addToListResponse.ok) {
      const result = await addToListResponse.json();
      console.log('✅ Added to list:', JSON.stringify(result, null, 2));
    } else {
      const error = await addToListResponse.text();
      console.log('❌ Error:', error);
    }

    // Wait and check result
    setTimeout(async () => {
      console.log('\n🔍 Checking final result...');
      
      const checkResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (checkResponse.ok) {
        const contactsData = await checkResponse.json();
        const testContact = contactsData.result?.find(contact => 
          contact.email === 'test2@example.com'
        );
        
        if (testContact) {
          console.log('✅ Final contact state:');
          console.log(`   Email: ${testContact.email}`);
          console.log(`   Lists: ${JSON.stringify(testContact.list_ids)}`);
          console.log(`   Custom fields: ${JSON.stringify(testContact.custom_fields)}`);
          
          // Check if it's in the newsletter list
          if (testContact.list_ids && testContact.list_ids.includes(newsletterListId)) {
            console.log('🎉 SUCCESS: Contact is in the newsletter list!');
          } else {
            console.log('❌ FAILED: Contact is not in the newsletter list');
          }
        } else {
          console.log('❌ Contact not found');
        }
      }
    }, 3000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCorrectListAddition();