
// Run this script to see your current environment variables
// Copy the output to create your .env file

console.log('# Environment Variables');
console.log('# Copy these to your .env file in your new environment\n');

const envVars = [
  'DATABASE_URL',
  'PAYSTACK_SECRET_KEY', 
  'PAYSTACK_PUBLIC_KEY',
  'SESSION_SECRET',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`${varName}=${value}`);
  } else {
    console.log(`${varName}=# NOT_SET`);
  }
});
