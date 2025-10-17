// Check the actual custom field IDs in SendGrid
require('dotenv').config({ path: './.env.local' });

async function getCustomFields() {
  console.log('🔍 Getting SendGrid custom field IDs...\n');
  
  try {
    const response = await fetch('https://api.sendgrid.com/v3/marketing/field_definitions', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📋 Custom Fields:');
    
    if (data.custom_fields && data.custom_fields.length > 0) {
      data.custom_fields.forEach(field => {
        console.log(`• ${field.name} (ID: ${field.id}) - Type: ${field.field_type}`);
      });
    } else {
      console.log('❌ No custom fields found');
    }

    // Also check reserved fields
    if (data.reserved_fields && data.reserved_fields.length > 0) {
      console.log('\n📋 Reserved Fields:');
      data.reserved_fields.forEach(field => {
        console.log(`• ${field.name} (ID: ${field.id}) - Type: ${field.field_type}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getCustomFields();