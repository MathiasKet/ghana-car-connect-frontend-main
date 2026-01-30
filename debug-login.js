// Debug script to test login functionality
// Copy and paste this into your browser console on your website

console.log('🔍 Starting Login Debug...');

// Test 1: Check if Supabase client is available
try {
  if (typeof window.supabase !== 'undefined') {
    console.log('✅ Supabase client available');
  } else {
    console.log('❌ Supabase client not available');
  }
} catch (e) {
  console.log('❌ Error checking Supabase client:', e);
}

// Test 2: Check current auth state
try {
  const { data: { session } } = supabase.auth.getSession();
  console.log('🔐 Current session:', session);
} catch (e) {
  console.log('❌ Error getting session:', e);
}

// Test 3: Test manual login
async function testManualLogin() {
  console.log('🧪 Testing manual login...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    console.log('🔐 Manual login result:', { data, error });
    
    if (error) {
      console.log('💡 Login error details:', {
        message: error.message,
        status: error.status,
        code: error.code
      });
    }
  } catch (e) {
    console.log('❌ Manual login failed:', e);
  }
}

// Test 4: Check React components
try {
  console.log('🔍 Checking React components...');
  
  // Find login form
  const loginForm = document.querySelector('form');
  if (loginForm) {
    console.log('✅ Login form found');
    
    // Check form submission
    loginForm.addEventListener('submit', (e) => {
      console.log('📝 Form submitted:', e);
    });
  } else {
    console.log('❌ Login form not found');
  }
  
  // Check for error messages
  const errorElements = document.querySelectorAll('[role="alert"], .error, .text-red-500');
  console.log('🚨 Error elements found:', errorElements.length);
  
} catch (e) {
  console.log('❌ Error checking components:', e);
}

// Run the tests
testManualLogin();

console.log('🔍 Debug script complete! Check the results above.');
