// Check existing contacts that DO have custom fields to understand the working format
require('dotenv').config({ path: './.env.local' });

async function checkWorkingCustomFields() {
  console.log('🔍 Checking existing contacts that have custom fields working...\n');
  
  try {
    // Get all contacts and find ones that actually have custom fields
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      
      console.log('📊 All contacts and their custom fields:');
      contactsData.result?.forEach(contact => {
        const hasCustomFields = contact.custom_fields && Object.keys(contact.custom_fields).length > 0;
        console.log(`\n📧 ${contact.email}:`);
        console.log(`   ID: ${contact.id}`);
        console.log(`   Lists: ${JSON.stringify(contact.list_ids)}`);
        console.log(`   Custom Fields: ${JSON.stringify(contact.custom_fields)}`);
        console.log(`   Has Custom Fields: ${hasCustomFields ? '✅' : '❌'}`);
        console.log(`   Created: ${contact.created_at}`);
        console.log(`   Updated: ${contact.updated_at}`);
      });

      // Find contacts that DO have custom fields
      const contactsWithFields = contactsData.result?.filter(contact => 
        contact.custom_fields && Object.keys(contact.custom_fields).length > 0
      ) || [];

      console.log(`\n🎯 Found ${contactsWithFields.length} contacts with custom fields:`);
      
      if (contactsWithFields.length > 0) {
        contactsWithFields.forEach(contact => {
          console.log(`\n✅ ${contact.email}:`);
          Object.entries(contact.custom_fields).forEach(([key, value]) => {
            console.log(`   ${key}: ${value} (type: ${typeof value})`);
          });
        });

        // Try to update tim@onemorelight.cc using the EXACT same format as working contacts
        const workingContact = contactsWithFields[0];
        console.log(`\n📤 Trying to update tim@onemorelight.cc using format from ${workingContact.email}...`);
        
        // Use the exact same custom field structure but with newsletter values
        const updateData = {
          contacts: [{
            email: 'tim@onemorelight.cc',
            custom_fields: {
              // Use the exact same keys as the working contact
              ...(workingContact.custom_fields)
            }
          }]
        };

        // Override with our newsletter values but keep the same structure
        if (updateData.contacts[0].custom_fields.hasOwnProperty('subscription_type')) {
          updateData.contacts[0].custom_fields.subscription_type = 'newsletter';
        }
        if (updateData.contacts[0].custom_fields.hasOwnProperty('source')) {
          updateData.contacts[0].custom_fields.source = 'Newsletter Signup';
        }
        if (updateData.contacts[0].custom_fields.hasOwnProperty('signup_date')) {
          updateData.contacts[0].custom_fields.signup_date = '2025-10-17';
        }

        console.log('Using this update data:');
        console.log(JSON.stringify(updateData, null, 2));

        const updateResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (updateResponse.ok) {
          const result = await updateResponse.json();
          console.log(`✅ Update using working format job: ${result.job_id}`);
        } else {
          const error = await updateResponse.text();
          console.log('❌ Update failed:', error);
        }

      } else {
        console.log('❌ No contacts found with custom fields - this might be a permissions issue');
      }

    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkWorkingCustomFields();