// Check all SendGrid lists and contacts
require('dotenv').config({ path: './.env.local' });

async function checkAllLists() {
  console.log('🔍 Checking all SendGrid lists and contacts...');
  
  try {
    // Get all lists
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!listsResponse.ok) {
      console.error('Failed to fetch lists');
      return;
    }

    const listsData = await listsResponse.json();
    console.log(`📋 Total lists: ${listsData.result?.length || 0}`);
    
    if (listsData.result) {
      listsData.result.forEach((list, index) => {
        console.log(`${index + 1}. "${list.name}" (ID: ${list.id})`);
        console.log(`   Contact Count: ${list.contact_count}`);
        console.log(`   Created: ${list._metadata?.self || 'N/A'}`);
      });
    }

    // Get all contacts regardless of list
    console.log('\n📧 All contacts in account:');
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      console.log(`Total contacts in account: ${contactsData.contact_count || 0}`);

      if (contactsData.result && contactsData.result.length > 0) {
        console.log('\nContacts found:');
        contactsData.result.forEach((contact, index) => {
          console.log(`\n${index + 1}. ${contact.email}`);
          if (contact.first_name) console.log(`   Name: ${contact.first_name}`);
          console.log(`   Created: ${contact.created_at}`);
          console.log(`   Lists: ${contact.list_ids ? JSON.stringify(contact.list_ids) : 'No lists'}`);
          
          if (contact.custom_fields && Object.keys(contact.custom_fields).length > 0) {
            console.log('   Custom Fields:');
            Object.entries(contact.custom_fields).forEach(([fieldId, value]) => {
              let fieldName = fieldId;
              switch(fieldId) {
                case 'e1_T': fieldName = 'subscription_type'; break;
                case 'w2_D': fieldName = 'signup_date'; break;
                case 'w3_T': fieldName = 'source'; break;
              }
              console.log(`     • ${fieldName}: ${value}`);
            });
          }
        });
      } else {
        console.log('No contacts found in entire account');
      }
    } else {
      console.log('Failed to fetch contacts');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAllLists();