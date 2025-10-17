// Test repeat registration behavior
require('dotenv').config({ path: './.env.local' });

async function testRepeatRegistration() {
  console.log('🔄 Testing repeat registration behavior...');
  
  const testEmail = 'repeat-test@example.com';
  const testName = 'Repeat Test User';
  
  console.log(`\n📧 Testing with: ${testEmail}`);
  
  // First registration
  console.log('\n1️⃣ First Registration:');
  try {
    const response1 = await fetch('http://localhost:3000/api/register-meditation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: testName,
        email: testEmail
      }),
    });

    const result1 = await response1.json();
    console.log('Response:', result1.message);
    
    if (response1.ok) {
      console.log('✅ First registration successful');
    } else {
      console.log('❌ First registration failed');
    }
  } catch (error) {
    console.log('❌ Error in first registration:', error.message);
  }

  // Wait a moment
  console.log('\n⏰ Waiting 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Second registration (same email)
  console.log('\n2️⃣ Second Registration (Same Email):');
  try {
    const response2 = await fetch('http://localhost:3000/api/register-meditation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: testName + ' (Week 2)',
        email: testEmail
      }),
    });

    const result2 = await response2.json();
    console.log('Response:', result2.message);
    
    if (response2.ok) {
      console.log('✅ Second registration successful');
    } else {
      console.log('❌ Second registration failed');
    }
  } catch (error) {
    console.log('❌ Error in second registration:', error.message);
  }

  console.log('\n📊 Summary:');
  console.log('• Both registrations should succeed');
  console.log('• Both should send confirmation emails');
  console.log('• Contact list should have only ONE entry (updated, not duplicated)');
  console.log('• Signup date should show the latest registration');
  
  console.log('\n💡 This is perfect for weekly events!');
  console.log('• People can register each week');
  console.log('• They always get the Google Meet link');
  console.log('• No duplicate contacts in your list');
}

testRepeatRegistration();