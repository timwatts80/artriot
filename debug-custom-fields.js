// Check current contact and debug custom fields issue
require('dotenv').config({ path: './.env.local' });

async function debugCustomFields() {
  console.log('🔍 Debugging custom fields issue for tim@onemorelight.cc...\n');
  
  try {
    // 1. First, check the current state of tim@onemorelight.cc
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const contactsData = await contactsResponse.json();
    const timContact = contactsData.result?.find(contact => 
      contact.email === 'tim@onemorelight.cc'
    );
    
    if (timContact) {
      console.log('📧 Current tim@onemorelight.cc state:');
      console.log(`   Contact ID: ${timContact.id}`);
      console.log(`   Lists: ${JSON.stringify(timContact.list_ids)}`);
      console.log(`   Custom Fields: ${JSON.stringify(timContact.custom_fields)}`);
      console.log(`   Updated: ${timContact.updated_at}`);
    }

    // 2. Check what custom field definitions exist
    console.log('\n📋 Checking custom field definitions...');
    const fieldsResponse = await fetch('https://api.sendgrid.com/v3/marketing/field_definitions', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (fieldsResponse.ok) {
      const fieldsData = await fieldsResponse.json();
      console.log('Available custom fields:');
      fieldsData.custom_fields?.forEach(field => {
        console.log(`   • ${field.name} (ID: ${field.id}) - Type: ${field.field_type}`);
      });
    }

    // 3. Test updating tim@onemorelight.cc with custom fields explicitly
    console.log('\n📤 Testing custom field update for tim@onemorelight.cc...');
    
    const updateData = {
      contacts: [{
        email: 'tim@onemorelight.cc',
        custom_fields: {
          'e1_T': 'newsletter',
          'w2_D': '2025-10-17',
          'w3_T': 'Newsletter Signup'
        }
      }]
    };

    console.log('Sending update with custom fields:');
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
      console.log(`✅ Custom field update job submitted: ${result.job_id}`);
      
      // Wait and check if custom fields were applied
      setTimeout(async () => {
        console.log('\n🔍 Checking if custom fields were applied...');
        
        const checkResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          const updatedContact = checkData.result?.find(contact => 
            contact.email === 'tim@onemorelight.cc'
          );
          
          if (updatedContact) {
            console.log('📧 Updated contact state:');
            console.log(`   Custom Fields: ${JSON.stringify(updatedContact.custom_fields)}`);
            console.log(`   Lists: ${JSON.stringify(updatedContact.list_ids)}`);
            console.log(`   Updated: ${updatedContact.updated_at}`);
            
            if (updatedContact.custom_fields && Object.keys(updatedContact.custom_fields).length > 0) {
              console.log('✅ SUCCESS: Custom fields are now populated!');
              
              // Now try list assignment with proper custom fields
              console.log('\n📋 Now trying list assignment with custom fields...');
              await tryListAssignmentWithCustomFields(updatedContact.id);
              
            } else {
              console.log('❌ FAILED: Custom fields are still empty');
            }
          }
        }
      }, 10000); // Wait 10 seconds

    } else {
      const error = await updateResponse.text();
      console.log('❌ Custom field update failed:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function tryListAssignmentWithCustomFields(contactId) {
  const newsletterListId = '85680db6-50b5-4b40-b9fc-e9b9dd6db906';
  
  try {
    const listAssignmentData = {
      contacts: [{
        id: contactId,
        list_ids: [newsletterListId],
        custom_fields: {
          'e1_T': 'newsletter',
          'w2_D': '2025-10-17', 
          'w3_T': 'Newsletter Signup'
        }
      }]
    };

    const listResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listAssignmentData),
    });

    if (listResponse.ok) {
      const result = await listResponse.json();
      console.log(`✅ List assignment with custom fields job: ${result.job_id}`);
    } else {
      const error = await listResponse.text();
      console.log('❌ List assignment failed:', error);
    }

  } catch (error) {
    console.error('❌ List assignment error:', error.message);
  }
}

debugCustomFields();