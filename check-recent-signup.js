// Check what happened with the most recent newsletter signup
require('dotenv').config({ path: './.env.local' });

async function checkRecentSignup() {
  console.log('🔍 Checking most recent newsletter signup...\n');
  
  try {
    // Get all contacts and look for the newest tim@onemorelight.cc
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!contactsResponse.ok) {
      throw new Error(`Contacts API error: ${contactsResponse.statusText}`);
    }

    const contactsData = await contactsResponse.json();
    
    // Find tim@onemorelight.cc (should be recreated)
    const timContact = contactsData.result?.find(contact => 
      contact.email === 'tim@onemorelight.cc'
    );
    
    if (timContact) {
      console.log('✅ tim@onemorelight.cc found after form test:');
      console.log(`   🆔 Contact ID: ${timContact.id}`);
      console.log(`   📧 Email: ${timContact.email}`);
      console.log(`   📋 Lists: ${JSON.stringify(timContact.list_ids)}`);
      console.log(`   📅 Created: ${timContact.created_at}`);
      console.log(`   🔄 Updated: ${timContact.updated_at}`);
      
      if (timContact.custom_fields) {
        console.log('   📝 Custom Fields:');
        Object.entries(timContact.custom_fields).forEach(([key, value]) => {
          console.log(`      ${key}: ${value}`);
        });
      } else {
        console.log('   📝 Custom Fields: {}');
      }
      
      // Check if it has proper custom fields now
      const hasCustomFields = timContact.custom_fields && Object.keys(timContact.custom_fields).length > 0;
      console.log(`   ✅ Has Custom Fields: ${hasCustomFields ? 'YES' : 'NO'}`);
      
      // Check if it's in any lists
      const isInLists = timContact.list_ids && timContact.list_ids.length > 0;
      console.log(`   📋 In Lists: ${isInLists ? 'YES' : 'NO'}`);
      
    } else {
      console.log('❌ tim@onemorelight.cc NOT FOUND after form test');
      console.log('This suggests the contact creation is still processing...');
    }

    // Show all recent contacts (last 30 minutes)
    console.log('\n⏰ All contacts updated in last 30 minutes:');
    const thirtyMinutesAgo = new Date(Date.now() - (30 * 60 * 1000));
    
    const recentContacts = contactsData.result?.filter(contact => {
      const updatedAt = new Date(contact.updated_at);
      return updatedAt > thirtyMinutesAgo;
    }) || [];

    if (recentContacts.length > 0) {
      recentContacts.forEach(contact => {
        console.log(`\n📧 ${contact.email}:`);
        console.log(`   Created: ${contact.created_at}`);
        console.log(`   Updated: ${contact.updated_at}`);
        console.log(`   Lists: ${JSON.stringify(contact.list_ids)}`);
        console.log(`   Custom Fields: ${JSON.stringify(contact.custom_fields)}`);
      });
    } else {
      console.log('   No contacts updated in the last 30 minutes');
    }

    // Check list counts
    console.log('\n📊 Current list status:');
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (listsResponse.ok) {
      const listsData = await listsResponse.json();
      
      listsData.result?.forEach(list => {
        console.log(`   📋 ${list.name}: ${list.contact_count} contacts (ID: ${list.id})`);
      });
      
      // Specifically check if ArtRiot Newsletter has any contacts
      const newsletterList = listsData.result?.find(list => list.name === 'ArtRiot Newsletter');
      if (newsletterList && newsletterList.contact_count > 0) {
        console.log('\n🎉 ArtRiot Newsletter has contacts! Let me check who they are...');
        
        // This would require a different API call to get contacts by list
        // For now, let's see if any contact has the newsletter list ID
        const contactsInNewsletter = contactsData.result?.filter(contact => 
          contact.list_ids && contact.list_ids.includes(newsletterList.id)
        ) || [];
        
        if (contactsInNewsletter.length > 0) {
          console.log('📧 Contacts in ArtRiot Newsletter:');
          contactsInNewsletter.forEach(contact => {
            console.log(`   • ${contact.email}`);
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRecentSignup();