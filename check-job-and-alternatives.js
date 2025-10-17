// Check job status and try alternative approach
require('dotenv').config({ path: './.env.local' });

async function checkJobStatusAndTryAlternative() {
  console.log('🧪 Checking job status and trying alternative approaches...\n');
  
  try {
    // Check the job status from the previous attempt
    const jobId = 'a73ca15c-c0b6-4079-b38b-1d1d913f5234';
    
    console.log(`📊 Checking job status: ${jobId}`);
    const jobResponse = await fetch(`https://api.sendgrid.com/v3/marketing/contacts/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (jobResponse.ok) {
      const jobData = await jobResponse.json();
      console.log('📋 Job status:', JSON.stringify(jobData, null, 2));
    } else {
      console.log(`❌ Job status check failed: ${jobResponse.status} ${jobResponse.statusText}`);
    }

    // Try alternative: Use the marketing/contacts/imports endpoint
    console.log('\n📤 Trying contacts import endpoint...');
    
    const newsletterListId = '85680db6-50b5-4b40-b9fc-e9b9dd6db906';
    
    const importData = {
      contacts: [{
        email: 'tim@onemorelight.cc',
        custom_fields: {
          'e1_T': 'newsletter',
          'w2_D': new Date().toISOString().split('T')[0],
          'w3_T': 'Newsletter Signup'
        }
      }],
      list_ids: [newsletterListId]
    };

    const importResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts/imports', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(importData),
    });

    console.log(`Import Response: ${importResponse.status} ${importResponse.statusText}`);
    
    if (importResponse.ok) {
      const result = await importResponse.json();
      console.log('✅ Import result:', JSON.stringify(result, null, 2));
    } else {
      const error = await importResponse.text();
      console.log('❌ Import error:', error);
    }

    // Try yet another approach: List-specific contact addition
    console.log('\n📤 Trying direct list contact addition...');
    
    // Check if there's a way to add contact directly to a specific list
    const directListResponse = await fetch(`https://api.sendgrid.com/v3/marketing/lists/${newsletterListId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'ArtRiot Newsletter',
        contact_count_exclude_unsubscribes: true
      }),
    });

    console.log(`Direct list response: ${directListResponse.status} ${directListResponse.statusText}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkJobStatusAndTryAlternative();