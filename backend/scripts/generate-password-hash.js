// Generate password hash for sample users
// Run: node scripts/generate-password-hash.js

const bcrypt = require('bcryptjs');

const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }

  console.log('\n==============================================');
  console.log('Password Hash Generated');
  console.log('==============================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nUse this hash in your migration file!');
  console.log('==============================================\n');
});
