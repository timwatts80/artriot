// Fix tim@onemorelight.cc to be in both Waitlist and Art Riot lists
require('dotenv').config({ path: './.env.local' });

async function fixTimsContactLists() {
  console.log('🔧 Adding tim@onemorelight.cc to Art Riot list while keeping Waitlist...');
  
  try {
    // Get list IDs
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const listsData = await listsResponse.json();
    const waitlistId = listsData.result?.find(list => list.name === 'Waitlist')?.id;
    const artRiotId = listsData.result?.find(list => list.name === 'Art Riot')?.id;
    
    console.log(`Waitlist ID: ${waitlistId}`);
    console.log(`Art Riot ID: ${artRiotId}`);

    // Add tim@onemorelight.cc to both lists
    const contactData = {
      list_ids: [waitlistId, artRiotId], // Both lists
      contacts: [{
        email: 'tim@onemorelight.cc',
        first_name: 'Tim',
        last_name: 'Watts',
        custom_fields: {
          'e1_T': 'newsletter', // subscription_type
          'w2_D': new Date().toISOString().split('T')[0], // signup_date
          'w3_T': 'Newsletter Signup' // source
        }
      }]
    };

    console.log('\nUpdating contact with both list assignments...');
    
    const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (response.ok) {
      console.log('✅ Successfully updated contact lists');
      
      // Wait and check results
      console.log('\n⏰ Waiting 3 seconds to check results...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check Art Riot list count
      const artRiotCheck = await fetch(`https://api.sendgrid.com/v3/marketing/lists/${artRiotId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (artRiotCheck.ok) {
        const artRiotInfo = await artRiotCheck.json();
        console.log(`🎨 Art Riot list now has ${artRiotInfo.contact_count} contacts`);
      }

      // Check Waitlist count  
      const waitlistCheck = await fetch(`https://api.sendgrid.com/v3/marketing/lists/${waitlistId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (waitlistCheck.ok) {
        const waitlistInfo = await waitlistCheck.json();
        console.log(`📋 Waitlist still has ${waitlistInfo.contact_count} contacts`);
      }

    } else {
      const error = await response.text();
      console.log('❌ Failed to update contact:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixTimsContactLists();