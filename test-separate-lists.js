// Test both APIs with the new separate lists
require('dotenv').config({ path: './.env.local' });

async function testSeparateListsAPIs() {
  console.log('🎯 Testing separate lists implementation...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  console.log('📧 Testing Newsletter Signup...');
  try {
    const newsletterResponse = await fetch(`${baseUrl}/api/newsletter-signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-newsletter-separate@example.com'
      }),
    });

    const newsletterResult = await newsletterResponse.json();
    console.log(`Newsletter API: ${newsletterResponse.status}`);
    console.log(`Response: ${newsletterResult.message || newsletterResult.error}`);
    
    if (newsletterResponse.ok) {
      console.log('✅ Newsletter signup successful');
    } else {
      console.log('❌ Newsletter signup failed');
    }
  } catch (error) {
    console.log('❌ Newsletter signup error:', error.message);
  }

  console.log('\n🎨 Testing Art Meditation Registration...');
  try {
    const registrationResponse = await fetch(`${baseUrl}/api/register-meditation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Separate Lists',
        email: 'test-registration-separate@example.com'
      }),
    });

    const registrationResult = await registrationResponse.json();
    console.log(`Registration API: ${registrationResponse.status}`);
    console.log(`Response: ${registrationResult.message || registrationResult.error}`);
    
    if (registrationResponse.ok) {
      console.log('✅ Registration successful');
    } else {
      console.log('❌ Registration failed');
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }

  console.log('\n⏰ Waiting 5 seconds for SendGrid processing...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Check the new lists
  console.log('\n📊 Checking new list contents...');
  try {
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const listsData = await listsResponse.json();
    
    const newsletterList = listsData.result?.find(list => list.name === 'ArtRiot Newsletter');
    const eventsList = listsData.result?.find(list => list.name === 'Art Meditation Events');
    
    console.log(`📧 ArtRiot Newsletter: ${newsletterList?.contact_count || 0} contacts`);
    console.log(`🎨 Art Meditation Events: ${eventsList?.contact_count || 0} contacts`);
    
    if (newsletterList?.contact_count > 0 || eventsList?.contact_count > 0) {
      console.log('\n🎉 Separate lists are working!');
    } else {
      console.log('\n⏰ Lists may need more time to update...');
    }
    
  } catch (error) {
    console.log('Could not check lists:', error.message);
  }

  console.log('\n💡 Benefits of separate lists:');
  console.log('✅ Newsletter source tracking preserved');
  console.log('✅ Event registration source tracking preserved');
  console.log('✅ No cross-contamination of custom fields');
  console.log('✅ Better segmentation and analytics possible');
}

testSeparateListsAPIs();