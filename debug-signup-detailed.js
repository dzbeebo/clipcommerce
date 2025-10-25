// Detailed debug script for creator signup
const testData = {
  email: 'test@example.com',
  password: 'testpassword123',
  confirmPassword: 'testpassword123',
  displayName: 'Test Creator',
  terms: true
};

console.log('🔍 Testing creator signup with detailed validation...\n');

// Test each field individually
console.log('📋 Field validation:');
console.log('Email:', testData.email, '- Valid email?', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testData.email));
console.log('Password length:', testData.password.length, '- Min 8?', testData.password.length >= 8);
console.log('Display name length:', testData.displayName.length, '- Min 2?', testData.displayName.length >= 2);
console.log('Terms accepted:', testData.terms, '- Required true?', testData.terms === true);
console.log('Passwords match:', testData.password === testData.confirmPassword);

console.log('\n🔍 Sending request...');

fetch('http://localhost:3000/api/auth/signup/creator', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => {
  console.log('\n📊 Response Status:', response.status);
  console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
  return response.text();
})
.then(text => {
  console.log('📋 Raw Response:', text);
  try {
    const data = JSON.parse(text);
    console.log('📋 Parsed Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('❌ Could not parse response as JSON');
  }
})
.catch(error => {
  console.error('\n❌ Request failed:', error.message);
});

