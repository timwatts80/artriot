// Update custom fields with both name and display name
require('dotenv').config({ path: './.env.local' });

async function updateFieldsWithDisplayNames() {
  console.log('Updating custom fields with display names...');
  
  const fieldUpdates = [
    { id: 'e1_T', name: 'subscription_type', displayName: 'Subscription Type' },
    { id: 'w2_D', name: 'signup_date', displayName: 'Signup Date' },
    { id: 'w3_T', name: 'source', displayName: 'Source' }
  ];

  try {
    for (const field of fieldUpdates) {
      console.log(`\nUpdating field ${field.id} (${field.name})...`);
      
      const response = await fetch(`https://api.sendgrid.com/v3/marketing/field_definitions/${field.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: field.name,
          display_name: field.displayName
        })
      });

      const responseText = await response.text();
      
      if (response.ok) {
        console.log(`✅ Updated ${field.name} with display name "${field.displayName}"`);
      } else {
        console.log(`❌ Failed to update ${field.name}:`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${responseText}`);
        
        // Try GET to see current field state
        const getResponse = await fetch(`https://api.sendgrid.com/v3/marketing/field_definitions/${field.id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (getResponse.ok) {
          const currentField = await getResponse.json();
          console.log(`   Current field state:`, JSON.stringify(currentField, null, 2));
        }
      }
    }

    console.log('\n💡 Alternative: Manual Steps for SendGrid Web Interface:');
    console.log('1. Log into SendGrid web interface');
    console.log('2. Go to Marketing > Field Definitions');
    console.log('3. Edit each custom field to add display names:');
    console.log('   • subscription_type → "Subscription Type"');
    console.log('   • signup_date → "Signup Date"'); 
    console.log('   • source → "Source"');
    console.log('4. Then go to Marketing > Contacts > Art Riot list');
    console.log('5. Look for column customization or table settings');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateFieldsWithDisplayNames();