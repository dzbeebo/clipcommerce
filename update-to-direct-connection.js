// Update to direct connection
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// Read current .env file
const envContent = fs.readFileSync(envPath, 'utf8');

// Extract the password from the current pooled URL
const currentUrlMatch = envContent.match(/DATABASE_URL=postgresql:\/\/postgres\.blbgusssrqzjxczmtqyt:([^@]+)@aws-1-us-west-1\.pooler\.supabase\.com:6543\/postgres/);

if (!currentUrlMatch) {
  console.error('❌ Could not find current pooled DATABASE_URL in .env');
  process.exit(1);
}

const password = currentUrlMatch[1];
console.log('🔍 Found password:', password);

// Create the direct connection URL
const directUrl = `postgresql://postgres:${password}@db.blbgusssrqzjxczmtqyt.supabase.co:5432/postgres`;

// Replace the DATABASE_URL line
const updatedEnvContent = envContent.replace(
  /DATABASE_URL=postgresql:\/\/postgres\.blbgusssrqzjxczmtqyt:[^@]+@aws-1-us-west-1\.pooler\.supabase\.com:6543\/postgres/,
  `DATABASE_URL=${directUrl}`
);

// Write the updated .env file
fs.writeFileSync(envPath, updatedEnvContent);

console.log('✅ Updated .env file with direct Supabase DATABASE_URL');
console.log('🔗 New URL:', directUrl);
console.log('🔧 You can now restart the server and test again');

