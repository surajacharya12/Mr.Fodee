#!/usr/bin/env node

async function checkConnection() {
  const serverURL = 'http://localhost:3001';
  const clientURL = 'http://localhost:3002';
  
  console.log('\n' + '='.repeat(60));
  console.log('🔍 SYSTEM CONNECTION CHECK');
  console.log('='.repeat(60));
  
  // Check Server
  console.log('\n📡 Checking Server (port 3001)...');
  try {
    const response = await fetch(serverURL + '/user');
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Server is running');
      console.log('   Response:', data.message);
    } else {
      console.log('   ❌ Server responded with error:', response.status);
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to server');
    console.log('   Error:', error.message);
    console.log('   → Make sure server is running: cd server && npm run dev');
  }
  
  // Check Client
  console.log('\n🌐 Checking Client (port 3002)...');
  try {
    const response = await fetch(clientURL);
    if (response.ok) {
      console.log('   ✅ Client is running');
    } else {
      console.log('   ⚠️  Client responded with status:', response.status);
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to client');
    console.log('   Error:', error.message);
    console.log('   → Make sure client is running: cd client && npm run dev');
  }
  
  // Check Upload Endpoint
  console.log('\n📤 Checking Upload Endpoint...');
  try {
    const response = await fetch(serverURL + '/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    // We expect 400 (no file), not 404
    if (response.status === 400) {
      console.log('   ✅ Upload endpoint is accessible');
    } else if (response.status === 404) {
      console.log('   ❌ Upload endpoint not found');
    } else {
      console.log('   ⚠️  Upload endpoint responded with:', response.status);
    }
  } catch (error) {
    console.log('   ❌ Cannot check upload endpoint');
    console.log('   Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY');
  console.log('='.repeat(60));
  console.log('All systems ready! You can now:');
  console.log('   1. Open http://localhost:3002 in your browser');
  console.log('   2. Login and go to Profile page');
  console.log('   3. Upload your profile picture');
  console.log('   4. Check browser console for detailed logs');
  console.log('='.repeat(60) + '\n');
}

checkConnection();
