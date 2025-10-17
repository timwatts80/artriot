// Update custom field display names for SendGrid web interface
require('dotenv').config({ path: './.env.local' });

async function updateFieldDisplayNames() {
  console.log('Updating custom field display names...');
  
  const fieldUpdates = [
    { id: 'e1_T', name: 'subscription_type', displayName: 'Subscription Type' },
    { id: 'w2_D', name: 'signup_date', displayName: 'Signup Date' },
    { id: 'w3_T', name: 'source', displayName: 'Source' }
  ];

  try {
    for (const field of fieldUpdates) {
      console.log(`\nUpdating ${field.name}...`);
      
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

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Updated ${field.name}: "${field.displayName}"`);
      } else {
        const error = await response.text();
        console.log(`❌ Failed to update ${field.name}: ${error}`);
      }
    }

    console.log('\n🎉 Display names updated! Now check SendGrid web interface:');
    console.log('1. Go to Marketing > Contacts');
    console.log('2. Click on "Art Riot" list');
    console.log('3. Look for column customization options');
    console.log('4. Your fields should now show as:');
    console.log('   • "Subscription Type" (instead of e1_T)');
    console.log('   • "Signup Date" (instead of w2_D)');
    console.log('   • "Source" (instead of w3_T)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateFieldDisplayNames();