// Update only display names for custom fields
require('dotenv').config({ path: './.env.local' });

async function updateDisplayNamesOnly() {
  console.log('Updating custom field display names only...');
  
  const fieldUpdates = [
    { id: 'e1_T', displayName: 'Subscription Type' },
    { id: 'w2_D', displayName: 'Signup Date' },
    { id: 'w3_T', displayName: 'Source' }
  ];

  try {
    for (const field of fieldUpdates) {
      console.log(`\nUpdating display name for field ${field.id}...`);
      
      const response = await fetch(`https://api.sendgrid.com/v3/marketing/field_definitions/${field.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_name: field.displayName
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Updated display name for ${field.id}: "${field.displayName}"`);
        console.log(`   Field details:`, JSON.stringify(result, null, 2));
      } else {
        const error = await response.text();
        console.log(`❌ Failed to update ${field.id}: ${error}`);
      }
    }

    // Verify the updates
    console.log('\n🔍 Verifying field definitions...');
    const fieldsResponse = await fetch('https://api.sendgrid.com/v3/marketing/field_definitions', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const fieldsData = await fieldsResponse.json();
    console.log('\n📋 Updated Custom Fields:');
    fieldsData.custom_fields?.forEach(field => {
      console.log(`• ${field.name} (${field.id}): "${field.display_name || 'No display name'}"`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateDisplayNamesOnly();