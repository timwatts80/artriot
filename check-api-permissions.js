// Check API key permissions and account status
require('dotenv').config({ path: './.env.local' });

async function checkApiPermissions() {
  console.log('🔍 Checking API key permissions and account status...\n');
  
  try {
    // Check API key scopes
    console.log('📋 Testing different API endpoints to check permissions...');
    
    // 1. Check if we can read lists (this works)
    console.log('\n1️⃣  Testing lists read permission...');
    const listsResponse = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Lists API: ${listsResponse.status} ${listsResponse.statusText}`);

    // 2. Check if we can read contacts (this works)
    console.log('\n2️⃣  Testing contacts read permission...');
    const contactsResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Contacts API: ${contactsResponse.status} ${contactsResponse.statusText}`);

    // 3. Check if we can send emails (this works)
    console.log('\n3️⃣  Testing email send permission...');
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'test@example.com' }], subject: 'Test' }],
        from: { email: 'tim@onemorelight.cc' },
        content: [{ type: 'text/plain', value: 'Test' }]
      }),
    });
    console.log(`Email API: ${emailResponse.status} ${emailResponse.statusText}`);

    // 4. Try to create a very simple contact without any custom fields
    console.log('\n4️⃣  Testing simple contact creation (no custom fields)...');
    const simpleContactData = {
      contacts: [{
        email: `simple-${Date.now()}@example.com`
      }]
    };

    const simpleResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simpleContactData),
    });

    console.log(`Simple contact: ${simpleResponse.status} ${simpleResponse.statusText}`);
    if (simpleResponse.ok) {
      const result = await simpleResponse.json();
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      const error = await simpleResponse.text();
      console.log('Error:', error);
    }

    // 5. Check account limits/status
    console.log('\n5️⃣  Checking account info...');
    const accountResponse = await fetch('https://api.sendgrid.com/v3/user/profile', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (accountResponse.ok) {
      const profile = await accountResponse.json();
      console.log('Account profile:', JSON.stringify(profile, null, 2));
    } else {
      console.log(`Account API: ${accountResponse.status} ${accountResponse.statusText}`);
    }

    // 6. Try a smaller wait and check for the simple contact
    setTimeout(async () => {
      console.log('\n🔍 Checking for simple contact after 5 seconds...');
      
      const checkResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (checkResponse.ok) {
        const contactsData = await checkResponse.json();
        const recentContacts = contactsData.result?.filter(contact => 
          contact.email.startsWith('simple-') || contact.email.startsWith('test-1760714559246')
        ) || [];
        
        console.log(`Recent test contacts found: ${recentContacts.length}`);
        recentContacts.forEach(contact => {
          console.log(`• ${contact.email} - Lists: ${JSON.stringify(contact.list_ids)}`);
        });
      }
    }, 5000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkApiPermissions();