// Test adding to different lists to see if the issue is specific to ArtRiot Newsletter
require('dotenv').config({ path: './.env.local' });

async function testDifferentLists() {
  console.log('🧪 Testing list assignment to different lists...\n');
  
  try {
    // Get all lists
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const listsData = await listsResponse.json();
    
    console.log('📋 Available lists:');
    listsData.result?.forEach(list => {
      console.log(`   • ${list.name} (ID: ${list.id}) - ${list.contact_count} contacts`);
    });

    // Find a list that already has contacts (to test with a known working list)
    const workingList = listsData.result?.find(list => list.contact_count > 0);
    const newsletterList = listsData.result?.find(list => list.name === 'ArtRiot Newsletter');
    
    if (workingList) {
      console.log(`\n📤 Testing with working list: ${workingList.name} (${workingList.contact_count} contacts)`);
      
      // Try to add our test contact to the working list
      const testEmail = 'text-only-test-1760715403115@example.com'; // This one has custom fields
      
      const workingListData = {
        list_ids: [workingList.id],
        contacts: [{
          email: testEmail
        }]
      };

      console.log('Adding to working list...');
      console.log(JSON.stringify(workingListData, null, 2));

      const workingResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workingListData),
      });

      if (workingResponse.ok) {
        const result = await workingResponse.json();
        console.log(`✅ Working list job: ${result.job_id}`);
      } else {
        const error = await workingResponse.text();
        console.log('❌ Working list failed:', error);
      }
    }

    // Also check if the newsletter list has any special properties
    if (newsletterList) {
      console.log(`\n📋 Newsletter list details:`);
      console.log(`   Name: ${newsletterList.name}`);
      console.log(`   ID: ${newsletterList.id}`);
      console.log(`   Contact count: ${newsletterList.contact_count}`);
      console.log(`   Created: ${newsletterList.created_at}`);
      
      // Try to get more details about the list
      const listDetailResponse = await fetch(`https://api.sendgrid.com/v3/marketing/lists/${newsletterList.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (listDetailResponse.ok) {
        const listDetails = await listDetailResponse.json();
        console.log('   Details:', JSON.stringify(listDetails, null, 2));
      } else {
        console.log(`   Could not get details: ${listDetailResponse.status}`);
      }
    }

    // Try creating a simple test list and see if that works
    console.log('\n📤 Creating a test list...');
    
    const testListData = {
      name: `Test List ${Date.now()}`
    };

    const createListResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testListData),
    });

    if (createListResponse.ok) {
      const newList = await createListResponse.json();
      console.log(`✅ Created test list: ${newList.name} (${newList.id})`);
      
      // Try adding a contact to this fresh list
      setTimeout(async () => {
        console.log('\n📤 Testing with fresh list...');
        
        const freshListData = {
          list_ids: [newList.id],
          contacts: [{
            email: 'text-only-test-1760715403115@example.com'
          }]
        };

        const freshResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(freshListData),
        });

        if (freshResponse.ok) {
          const result = await freshResponse.json();
          console.log(`✅ Fresh list job: ${result.job_id}`);
        } else {
          const error = await freshResponse.text();
          console.log('❌ Fresh list failed:', error);
        }
      }, 2000);
      
    } else {
      const error = await createListResponse.text();
      console.log('❌ Could not create test list:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDifferentLists();