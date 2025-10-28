// Test script to verify the contact form API
const testContactForm = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'General Inquiry',
        message: 'This is a test message to verify the contact form is working correctly.'
      })
    });

    const data = await response.json();
    console.log('Response:', data);
    console.log('Status:', response.status);

    if (response.ok) {
      console.log('✅ Contact form test successful!');
    } else {
      console.log('❌ Contact form test failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run the test
testContactForm();