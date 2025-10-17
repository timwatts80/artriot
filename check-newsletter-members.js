// Check who is in the ArtRiot Newsletter list now
require('dotenv').config({ path: './.env.local' });

async function checkNewsletterListMembers() {
  console.log('🎉 Checking who is in the ArtRiot Newsletter list...\n');
  
  try {
    const newsletterListId = '85680db6-50b5-4b40-b9fc-e9b9dd6db906';
    
    // Get all contacts and filter for those in the newsletter list
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      
      // Find contacts in newsletter list
      const newsletterContacts = contactsData.result?.filter(contact => 
        contact.list_ids && contact.list_ids.includes(newsletterListId)
      ) || [];

      console.log(`📊 ArtRiot Newsletter list has ${newsletterContacts.length} contact(s):\n`);
      
      if (newsletterContacts.length > 0) {
        newsletterContacts.forEach((contact, index) => {
          console.log(`${index + 1}. 📧 ${contact.email}`);
          console.log(`   🆔 ID: ${contact.id}`);
          console.log(`   📅 Created: ${contact.created_at}`);
          console.log(`   🔄 Updated: ${contact.updated_at}`);
          console.log(`   📋 Lists: ${JSON.stringify(contact.list_ids)}`);
          
          if (contact.custom_fields && Object.keys(contact.custom_fields).length > 0) {
            console.log(`   📝 Custom Fields:`);
            Object.entries(contact.custom_fields).forEach(([key, value]) => {
              console.log(`      ${key}: ${value}`);
            });
          } else {
            console.log(`   📝 Custom Fields: None`);
          }
          console.log('');
        });

        // Check if this is tim@onemorelight.cc
        const timInNewsletter = newsletterContacts.find(contact => 
          contact.email === 'tim@onemorelight.cc'
        );

        if (timInNewsletter) {
          console.log('🎉 SUCCESS: tim@onemorelight.cc IS in the newsletter list!');
          console.log('The newsletter signup process is working correctly!');
        } else {
          console.log('📝 NOTE: tim@onemorelight.cc is not in the list yet (might still be processing)');
        }

      } else {
        console.log('❌ No contacts found in newsletter list (API might be showing cached data)');
      }

      // Also check if tim@onemorelight.cc exists anywhere
      const timContact = contactsData.result?.find(contact => 
        contact.email === 'tim@onemorelight.cc'
      );

      if (timContact) {
        console.log('\n👤 tim@onemorelight.cc current status:');
        console.log(`   🆔 ID: ${timContact.id}`);
        console.log(`   📋 Lists: ${JSON.stringify(timContact.list_ids)}`);
        console.log(`   📝 Custom Fields: ${JSON.stringify(timContact.custom_fields)}`);
        console.log(`   🔄 Updated: ${timContact.updated_at}`);
        
        if (timContact.list_ids && timContact.list_ids.includes(newsletterListId)) {
          console.log('   ✅ STATUS: In Newsletter List!');
        } else {
          console.log('   ⏳ STATUS: Not in Newsletter List yet (still processing)');
        }
      } else {
        console.log('\n⏳ tim@onemorelight.cc: Still being created...');
      }

    } else {
      console.error('❌ Failed to get contacts');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkNewsletterListMembers();