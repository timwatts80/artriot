// Check all lists and the contact assignment issue
require('dotenv').config({ path: './.env.local' });

async function checkListAssignments() {
  console.log('🔍 Checking all lists and contact assignments...\n');
  
  try {
    // Get all lists
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const listsData = await listsResponse.json();
    
    console.log('📋 All SendGrid Lists:');
    listsData.result?.forEach(list => {
      console.log(`• ${list.name} (ID: ${list.id}) - ${list.contact_count} contacts`);
    });

    // Find the newsletter list specifically
    const newsletterList = listsData.result?.find(list => list.name === 'ArtRiot Newsletter');
    const mysteryList = listsData.result?.find(list => list.id === 'a5be9857-e965-4772-9ba5-c8c1ee4171a1');
    
    console.log(`\n🎯 Newsletter List: ${newsletterList?.name} (${newsletterList?.id})`);
    console.log(`🤔 Mystery List: ${mysteryList?.name} (${mysteryList?.id})`);

    // Check tim@onemorelight.cc specifically
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      
      const timContact = contactsData.result?.find(contact => 
        contact.email === 'tim@onemorelight.cc'
      );
      
      if (timContact) {
        console.log('\n👤 tim@onemorelight.cc details:');
        console.log(`   Lists: ${JSON.stringify(timContact.list_ids)}`);
        console.log(`   Custom Fields: ${JSON.stringify(timContact.custom_fields)}`);
        console.log(`   Created: ${timContact.created_at}`);
        console.log(`   Updated: ${timContact.updated_at}`);
        
        // Show which lists these IDs correspond to
        if (timContact.list_ids && timContact.list_ids.length > 0) {
          console.log('\n📋 Lists for tim@onemorelight.cc:');
          timContact.list_ids.forEach(listId => {
            const listInfo = listsData.result?.find(list => list.id === listId);
            console.log(`   • ${listInfo?.name || 'Unknown'} (${listId})`);
          });
        }
      }

      // Check test@example.com
      const testContact = contactsData.result?.find(contact => 
        contact.email === 'test@example.com'
      );
      
      if (testContact) {
        console.log('\n🧪 test@example.com details:');
        console.log(`   Lists: ${JSON.stringify(testContact.list_ids)}`);
        console.log(`   Custom Fields: ${JSON.stringify(testContact.custom_fields)}`);
        
        if (testContact.list_ids && testContact.list_ids.length > 0) {
          console.log('\n📋 Lists for test@example.com:');
          testContact.list_ids.forEach(listId => {
            const listInfo = listsData.result?.find(list => list.id === listId);
            console.log(`   • ${listInfo?.name || 'Unknown'} (${listId})`);
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkListAssignments();