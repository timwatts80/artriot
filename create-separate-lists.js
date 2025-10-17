// Create two separate lists for better source tracking
require('dotenv').config({ path: './.env.local' });

async function createSeparateLists() {
  console.log('🎯 Creating separate lists for better tracking...\n');
  
  try {
    // First, check existing lists
    console.log('📋 Checking existing lists...');
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const existingLists = await listsResponse.json();
    console.log(`Found ${existingLists.result?.length || 0} existing lists:`);
    existingLists.result?.forEach((list, index) => {
      console.log(`${index + 1}. "${list.name}" (${list.contact_count} contacts)`);
    });

    // Check if new lists already exist
    const newsletterExists = existingLists.result?.find(list => list.name === 'ArtRiot Newsletter');
    const eventsExists = existingLists.result?.find(list => list.name === 'Art Meditation Events');

    // Create ArtRiot Newsletter list
    if (!newsletterExists) {
      console.log('\n📧 Creating "ArtRiot Newsletter" list...');
      const newsletterListData = {
        name: 'ArtRiot Newsletter'
      };

      const newsletterResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsletterListData),
      });

      if (newsletterResponse.ok) {
        const newsletterResult = await newsletterResponse.json();
        console.log(`✅ Created "ArtRiot Newsletter" list`);
        console.log(`   ID: ${newsletterResult.id}`);
      } else {
        const error = await newsletterResponse.text();
        console.log(`❌ Failed to create newsletter list: ${error}`);
      }
    } else {
      console.log('\n📧 "ArtRiot Newsletter" list already exists');
      console.log(`   ID: ${newsletterExists.id}`);
    }

    // Create Art Meditation Events list
    if (!eventsExists) {
      console.log('\n🎨 Creating "Art Meditation Events" list...');
      const eventsListData = {
        name: 'Art Meditation Events'
      };

      const eventsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventsListData),
      });

      if (eventsResponse.ok) {
        const eventsResult = await eventsResponse.json();
        console.log(`✅ Created "Art Meditation Events" list`);
        console.log(`   ID: ${eventsResult.id}`);
      } else {
        const error = await eventsResponse.text();
        console.log(`❌ Failed to create events list: ${error}`);
      }
    } else {
      console.log('\n🎨 "Art Meditation Events" list already exists');
      console.log(`   ID: ${eventsExists.id}`);
    }

    // Show final list of all lists
    console.log('\n📊 Final list summary:');
    const finalListsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const finalLists = await finalListsResponse.json();
    finalLists.result?.forEach((list, index) => {
      console.log(`${index + 1}. "${list.name}"`);
      console.log(`   ID: ${list.id}`);
      console.log(`   Contacts: ${list.contact_count}`);
      console.log('');
    });

    console.log('🎉 List creation complete!');
    console.log('\n💡 Next steps:');
    console.log('1. Update newsletter API to use "ArtRiot Newsletter" list');
    console.log('2. Update registration API to use "Art Meditation Events" list');
    console.log('3. Test both forms to ensure proper list assignment');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createSeparateLists();