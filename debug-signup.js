// Debug script to test creator signup with proper data
const testData = {
  email: 'test@example.com',
  password: 'testpassword123',
  confirmPassword: 'testpassword123',
  displayName: 'Test Creator',
  terms: true
};

console.log('🔍 Testing creator signup with data:');
console.log(JSON.stringify(testData, null, 2));

fetch('http://localhost:3000/api/auth/signup/creator', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => {
  console.log('\n📊 Response Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('📋 Response Data:', JSON.stringify(data, null, 2));
  
  if (data.error) {
    console.log('\n❌ Error details:', data.error);
  } else {
    console.log('\n✅ Signup successful!');
  }
})
.catch(error => {
  console.error('\n❌ Request failed:', error.message);
});
