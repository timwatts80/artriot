// Check specifically for the newsletter list and recent additions
require('dotenv').config({ path: './.env.local' });

async function checkNewsletterListSpecifically() {
  console.log('🔍 Checking ArtRiot Newsletter list specifically...\n');
  
  try {
    // Get all lists to verify IDs
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const listsData = await listsResponse.json();
    const newsletterList = listsData.result?.find(list => list.name === 'ArtRiot Newsletter');
    
    if (!newsletterList) {
      console.log('❌ ArtRiot Newsletter list not found!');
      return;
    }

    console.log(`📧 ArtRiot Newsletter List:`);
    console.log(`   ID: ${newsletterList.id}`);
    console.log(`   Contact Count: ${newsletterList.contact_count}`);
    console.log(`   Server log used ID: 85680db6-50b5-4b40-b9fc-e9b9dd6db906`);
    console.log(`   Match: ${newsletterList.id === '85680db6-50b5-4b40-b9fc-e9b9dd6db906' ? '✅' : '❌'}`);

    // Get contacts specifically from this list
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      
      // Filter for contacts in newsletter list
      const newsletterContacts = contactsData.result?.filter(contact => 
        contact.list_ids && contact.list_ids.includes(newsletterList.id)
      ) || [];

      console.log(`\n📋 Contacts in ArtRiot Newsletter list: ${newsletterContacts.length}`);
      
      if (newsletterContacts.length > 0) {
        console.log('\n✅ Newsletter contacts found:');
        newsletterContacts.forEach((contact, index) => {
          console.log(`${index + 1}. ${contact.email}`);
          console.log(`   Created: ${contact.created_at}`);
          console.log(`   Updated: ${contact.updated_at}`);
          if (contact.custom_fields && contact.custom_fields.w3_T) {
            console.log(`   Source: ${contact.custom_fields.w3_T}`);
          }
        });
      } else {
        console.log('❌ No contacts found in newsletter list');
        
        // Check if tim@onemorelight.cc exists anywhere
        const timContact = contactsData.result?.find(contact => 
          contact.email === 'tim@onemorelight.cc'
        );
        
        if (timContact) {
          console.log('\n🔍 Found tim@onemorelight.cc in account:');
          console.log(`   Lists: ${JSON.stringify(timContact.list_ids)}`);
          console.log(`   Updated: ${timContact.updated_at}`);
          if (timContact.custom_fields) {
            Object.entries(timContact.custom_fields).forEach(([key, value]) => {
              console.log(`   ${key}: ${value}`);
            });
          }
        } else {
          console.log('\n❌ tim@onemorelight.cc not found in account at all');
        }
      }
    }

    // Check for very recent contacts (within last hour)
    console.log('\n⏰ Checking for very recent contact additions...');
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
    
    if (contactsData && contactsData.result) {
      const recentContacts = contactsData.result.filter(contact => {
        const createdAt = new Date(contact.created_at);
        const updatedAt = new Date(contact.updated_at);
        return updatedAt > oneHourAgo || createdAt > oneHourAgo;
      });

      console.log(`Recent contacts (last hour): ${recentContacts.length}`);
      recentContacts.forEach(contact => {
        console.log(`• ${contact.email} - Updated: ${contact.updated_at}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkNewsletterListSpecifically();