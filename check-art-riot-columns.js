// Check Art Riot contact list columns and data
require('dotenv').config({ path: './.env.local' });

async function checkArtRiotListColumns() {
  console.log('Checking Art Riot contact list columns and data...');
  
  try {
    // Get Art Riot list ID
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const listsData = await listsResponse.json();
    const artRiotList = listsData.result?.find(list => list.name === 'Art Riot');
    
    if (!artRiotList) {
      console.log('❌ Art Riot list not found');
      return;
    }

    console.log(`📋 Art Riot List Info:`);
    console.log(`   ID: ${artRiotList.id}`);
    console.log(`   Contact Count: ${artRiotList.contact_count}`);

    // Get all contacts with their data
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!contactsResponse.ok) {
      const error = await contactsResponse.text();
      console.error('❌ Error fetching contacts:', error);
      return;
    }

    const contactsData = await contactsResponse.json();
    console.log(`\n📧 Total contacts in account: ${contactsData.contact_count || 0}`);

    if (contactsData.result && contactsData.result.length > 0) {
      // Filter contacts that are in the Art Riot list
      const artRiotContacts = contactsData.result.filter(contact => 
        contact.list_ids && contact.list_ids.includes(artRiotList.id)
      );

      console.log(`\n🎨 Contacts in Art Riot list: ${artRiotContacts.length}`);

      if (artRiotContacts.length > 0) {
        console.log('\n📊 Contact data structure and columns:');
        
        // Show the first contact to see available columns
        const firstContact = artRiotContacts[0];
        console.log('\nAvailable columns/fields:');
        Object.keys(firstContact).forEach((key, index) => {
          const value = firstContact[key];
          const valuePreview = typeof value === 'object' ? JSON.stringify(value) : String(value);
          const truncated = valuePreview.length > 50 ? valuePreview.substring(0, 50) + '...' : valuePreview;
          console.log(`${index + 1}. ${key}: ${truncated}`);
        });

        console.log('\n📋 All Art Riot contacts:');
        artRiotContacts.forEach((contact, index) => {
          console.log(`\n${index + 1}. ${contact.email}`);
          if (contact.first_name) console.log(`   Name: ${contact.first_name}`);
          if (contact.last_name) console.log(`   Last Name: ${contact.last_name}`);
          if (contact.custom_fields && Object.keys(contact.custom_fields).length > 0) {
            console.log(`   Custom Fields:`);
            Object.entries(contact.custom_fields).forEach(([fieldId, value]) => {
              console.log(`     ${fieldId}: ${value}`);
            });
          }
          if (contact.created_at) console.log(`   Created: ${contact.created_at}`);
          if (contact.updated_at) console.log(`   Updated: ${contact.updated_at}`);
        });
      } else {
        console.log('No contacts found in Art Riot list');
      }
    } else {
      console.log('No contacts found in account');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkArtRiotListColumns();