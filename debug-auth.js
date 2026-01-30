// Debug script to test Supabase connection
// Copy and paste this into your browser console on your website

import { createClient } from '@supabase/supabase-js';

// Test connection
const supabaseUrl = 'https://gyafbexyaenvkmsrrrqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YWZiZXh5YWVudmttc3JycnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTM0OTYsImV4cCI6MjA4NDk4OTQ5Nn0.MOGiOnZWogGYsGV_1JZkKTzIul4ZRjWgDpvMQKDvKXg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count');
    console.log('✅ Basic connection test:', { data, error });
    
    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('🔐 Auth session test:', { authData, authError });
    
    // Test table structure
    const { data: tableData, error: tableError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .limit(1);
    console.log('📊 Table structure test:', { tableData, tableError });
    
  } catch (err) {
    console.error('❌ Connection test failed:', err);
  }
}

// Test login with sample data
async function testLogin() {
  console.log('🔐 Testing login...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    console.log('🔐 Login test result:', { data, error });
    
    if (error) {
      console.log('💡 Error details:', {
        message: error.message,
        status: error.status,
        code: error.code
      });
    }
  } catch (err) {
    console.error('❌ Login test failed:', err);
  }
}

// Run tests
testConnection();
testLogin();
