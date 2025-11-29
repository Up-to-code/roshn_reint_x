import { auth } from '../lib/auth';
import 'dotenv/config';

async function testAuth() {
  console.log('Testing Better Auth initialization...');
  
  try {
    console.log('Auth object:', typeof auth);
    console.log('Auth.api exists:', !!auth.api);
    
    if (auth.api) {
      console.log('✅ Better Auth initialized successfully!');
    } else {
      console.error('❌ Better Auth API is undefined');
    }
  } catch (err) {
    console.error('❌ Better Auth initialization failed:', err);
  }
}

testAuth();
