// Check if the test emails from investigation worked
require('dotenv').config({ path: './.env.local' });

async function checkInvestigationResults() {
  console.log('🔍 Checking results from investigation tests...\n');
  
  try {
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      
      // Check for tim@onemorelight.cc
      const timContact = contactsData.result?.find(contact => 
        contact.email === 'tim@onemorelight.cc'
      );
      
      // Check for tim-test@onemorelight.cc
      const timTestContact = contactsData.result?.find(contact => 
        contact.email === 'tim-test@onemorelight.cc'
      );
      
      console.log('📧 tim@onemorelight.cc:');
      if (timContact) {
        console.log('✅ FOUND!');
        console.log(`   ID: ${timContact.id}`);
        console.log(`   Lists: ${JSON.stringify(timContact.list_ids)}`);
        console.log(`   Custom Fields: ${JSON.stringify(timContact.custom_fields)}`);
        console.log(`   Created: ${timContact.created_at}`);
        console.log(`   Updated: ${timContact.updated_at}`);
      } else {
        console.log('❌ Still not found');
      }
      
      console.log('\n📧 tim-test@onemorelight.cc:');
      if (timTestContact) {
        console.log('✅ FOUND!');
        console.log(`   ID: ${timTestContact.id}`);
        console.log(`   Lists: ${JSON.stringify(timTestContact.list_ids)}`);
        console.log(`   Custom Fields: ${JSON.stringify(timTestContact.custom_fields)}`);
        console.log(`   Created: ${timTestContact.created_at}`);
        console.log(`   Updated: ${timTestContact.updated_at}`);
      } else {
        console.log('❌ Not found yet');
      }
      
      // Show ALL contacts with onemorelight domain
      console.log('\n🔍 ALL contacts with onemorelight.cc domain:');
      const onemoreContacts = contactsData.result?.filter(contact => 
        contact.email.includes('onemorelight.cc')
      ) || [];
      
      if (onemoreContacts.length > 0) {
        onemoreContacts.forEach(contact => {
          console.log(`   📧 ${contact.email} (Created: ${contact.created_at})`);
        });
      } else {
        console.log('   None found');
      }
      
      // Check recent contacts (last 30 minutes)
      console.log('\n⏰ Contacts created/updated in last 30 minutes:');
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - (30 * 60 * 1000));
      
      const recentContacts = contactsData.result?.filter(contact => {
        const createdAt = new Date(contact.created_at);
        const updatedAt = new Date(contact.updated_at);
        return createdAt > thirtyMinutesAgo || updatedAt > thirtyMinutesAgo;
      }) || [];
      
      if (recentContacts.length > 0) {
        recentContacts.forEach(contact => {
          console.log(`   📧 ${contact.email}`);
          console.log(`      Created: ${contact.created_at}`);
          console.log(`      Updated: ${contact.updated_at}`);
          console.log(`      Custom Fields: ${JSON.stringify(contact.custom_fields)}`);
        });
      } else {
        console.log('   No recent activity');
      }
      
      // Check newsletter list count
      const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (listsResponse.ok) {
        const listsData = await listsResponse.json();
        const newsletterList = listsData.result?.find(list => list.name === 'ArtRiot Newsletter');
        console.log(`\n📊 ArtRiot Newsletter list: ${newsletterList?.contact_count || 0} contacts`);
      }
      
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkInvestigationResults();