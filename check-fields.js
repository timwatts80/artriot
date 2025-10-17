// Check SendGrid custom fields and update contact with proper field IDs
require('dotenv').config({ path: './.env.local' });

async function checkAndFixCustomFields() {
  console.log('Checking SendGrid custom fields...');
  
  try {
    // First, get all custom fields to see their IDs
    const fieldsResponse = await fetch('https://api.sendgrid.com/v3/marketing/field_definitions', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!fieldsResponse.ok) {
      const error = await fieldsResponse.text();
      console.error('❌ Error fetching custom fields:', error);
      return;
    }

    const fieldsData = await fieldsResponse.json();
    console.log('📋 Available custom fields:');
    
    const fieldMap = {};
    fieldsData.custom_fields?.forEach((field, index) => {
      console.log(`${index + 1}. ${field.name} (ID: ${field.id}, Type: ${field.field_type})`);
      fieldMap[field.name] = field.id;
    });

    // Check if our fields exist
    const requiredFields = ['subscription_type', 'signup_date', 'source'];
    const missingFields = requiredFields.filter(field => !fieldMap[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing custom fields:', missingFields);
      console.log('Please create these fields in SendGrid Marketing > Custom Fields');
      return;
    }

    console.log('✅ All required custom fields exist!');
    console.log('Field mapping:', {
      subscription_type: fieldMap.subscription_type,
      signup_date: fieldMap.signup_date,
      source: fieldMap.source
    });

    // Test adding a contact with proper field IDs
    console.log('\n🧪 Testing contact addition with field IDs...');
    
    const testContactData = {
      contacts: [{
        email: 'field-test@example.com',
        first_name: 'Field Test',
        custom_fields: {
          [fieldMap.subscription_type]: 'test-signup',
          [fieldMap.signup_date]: new Date().toISOString().split('T')[0], // Date format YYYY-MM-DD
          [fieldMap.source]: 'API Field Test'
        }
      }]
    };

    const addTestResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testContactData),
    });

    if (!addTestResponse.ok) {
      const error = await addTestResponse.text();
      console.error('❌ Error adding test contact:', error);
    } else {
      const result = await addTestResponse.json();
      console.log('✅ Test contact added with field IDs:', result);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAndFixCustomFields();