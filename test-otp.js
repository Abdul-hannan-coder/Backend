const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: '123456'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to log with colors
const log = (color, message) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Helper function to log test results
const logTest = (testName, success, details = '') => {
  const status = success ? '✅ PASS' : '❌ FAIL';
  const color = success ? colors.green : colors.red;
  log(color, `${status} - ${testName}`);
  if (details) {
    log(colors.cyan, `   Details: ${details}`);
  }
};

// Test functions
const tests = {
  // Test 1: Health Check
  async testHealth() {
    try {
      log(colors.blue, '\n🔍 Testing 1: Health Check');
      const response = await axios.get(`${BASE_URL}/health`);
      const success = response.data.success && response.data.database === 'connected';
      logTest('Health Check', success, `Database: ${response.data.database}`);
      return success;
    } catch (error) {
      logTest('Health Check', false, error.message);
      return false;
    }
  },

  // Test 2: Database Debug
  async testDatabaseDebug() {
    try {
      log(colors.blue, '\n🔍 Testing 2: Database Debug');
      const response = await axios.get(`${BASE_URL}/api/v1/auth/debug-database`);
      const data = response.data.data;
      
      const dbConnected = data.database.status === 'connected';
      const otpModelValid = data.models.otp.hasSchema && data.models.otp.modelName === 'Otp';
      const userModelValid = data.models.user.hasSchema && data.models.user.modelName === 'User';
      const otpCreationTest = data.testOtp === 'SUCCESS';
      
      logTest('Database Connection', dbConnected, `Status: ${data.database.status}`);
      logTest('OTP Model', otpModelValid, `Model: ${data.models.otp.modelName}, Schema: ${data.models.otp.hasSchema}`);
      logTest('User Model', userModelValid, `Model: ${data.models.user.modelName}, Schema: ${data.models.user.hasSchema}`);
      logTest('OTP Creation Test', otpCreationTest, `Result: ${data.testOtp}`);
      
      return dbConnected && otpModelValid && userModelValid && otpCreationTest;
    } catch (error) {
      logTest('Database Debug', false, error.message);
      return false;
    }
  },

  // Test 3: Check Existing OTPs
  async testExistingOTPs() {
    try {
      log(colors.blue, '\n🔍 Testing 3: Check Existing OTPs');
      const response = await axios.get(`${BASE_URL}/api/v1/auth/test-otps`);
      const data = response.data.data;
      
      log(colors.cyan, `   Found ${data.otpCount} OTPs in database`);
      log(colors.cyan, `   Found ${data.userCount} users in database`);
      
      if (data.otpCount > 0) {
        log(colors.yellow, '   Existing OTPs:');
        data.otps.forEach((otp, index) => {
          log(colors.yellow, `     ${index + 1}. Code: ${otp.code}, User: ${otp.user.fullName || 'Unknown'}, Expires: ${otp.expiresAt}`);
        });
      }
      
      if (data.userCount > 0) {
        log(colors.yellow, '   Existing Users:');
        data.users.forEach((user, index) => {
          log(colors.yellow, `     ${index + 1}. ${user.fullName} (${user.email}) - Verified: ${user.isVerified}`);
        });
      }
      
      return true;
    } catch (error) {
      logTest('Check Existing OTPs', false, error.message);
      return false;
    }
  },

  // Test 4: Test OTP Creation Directly
  async testOTPCreation() {
    try {
      log(colors.blue, '\n🔍 Testing 4: Direct OTP Creation');
      
      // First, get a user ID to test with
      const usersResponse = await axios.get(`${BASE_URL}/api/v1/auth/test-otps`);
      const users = usersResponse.data.data.users;
      
      if (users.length === 0) {
        logTest('Direct OTP Creation', false, 'No users found to test with');
        return false;
      }
      
      const testUserId = users[0]._id;
      log(colors.cyan, `   Testing with user ID: ${testUserId}`);
      
      const response = await axios.post(`${BASE_URL}/api/v1/auth/test-otp-creation`, {
        userId: testUserId,
        code: '123456'
      });
      
      const success = response.data.success && response.data.data.verification === 'PASSED';
      logTest('Direct OTP Creation', success, `Verification: ${response.data.data.verification}`);
      
      return success;
    } catch (error) {
      logTest('Direct OTP Creation', false, error.message);
      return false;
    }
  },

  // Test 5: Test User Registration (Full Flow)
  async testUserRegistration() {
    try {
      log(colors.blue, '\n🔍 Testing 5: User Registration (Full Flow)');
      
      const response = await axios.post(`${BASE_URL}/api/v1/auth/register`, TEST_USER);
      
      const success = response.data.success && response.data.userId;
      logTest('User Registration', success, `User ID: ${response.data.userId || 'None'}`);
      
      if (success) {
        log(colors.green, `   ✅ Registration successful! Check console for OTP creation logs.`);
        log(colors.cyan, `   User ID: ${response.data.userId}`);
        log(colors.cyan, `   Message: ${response.data.message}`);
      }
      
      return success;
    } catch (error) {
      if (error.response && error.response.data) {
        logTest('User Registration', false, `${error.response.data.message || error.message}`);
      } else {
        logTest('User Registration', false, error.message);
      }
      return false;
    }
  },

  // Test 6: Verify OTP After Registration
  async testOTPVerification() {
    try {
      log(colors.blue, '\n🔍 Testing 6: OTP Verification After Registration');
      
      // Wait a moment for OTP to be created
      log(colors.yellow, '   Waiting 2 seconds for OTP to be created...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if OTP was created
      const otpsResponse = await axios.get(`${BASE_URL}/api/v1/auth/test-otps`);
      const otps = otpsResponse.data.data.otps;
      
      if (otps.length === 0) {
        logTest('OTP Verification', false, 'No OTPs found after registration');
        return false;
      }
      
      // Find OTP for our test user
      const testUserOTP = otps.find(otp => otp.user.email === TEST_USER.email);
      
      if (!testUserOTP) {
        logTest('OTP Verification', false, 'No OTP found for test user');
        return false;
      }
      
      log(colors.green, `   ✅ OTP found for test user!`);
      log(colors.cyan, `   OTP Code: ${testUserOTP.code}`);
      log(colors.cyan, `   Expires: ${testUserOTP.expiresAt}`);
      
      // Try to verify the OTP
      try {
        const verifyResponse = await axios.post(`${BASE_URL}/api/v1/auth/verify-otp`, {
          email: TEST_USER.email,
          otp: testUserOTP.code
        });
        
        const verificationSuccess = verifyResponse.data.success;
        logTest('OTP Verification', verificationSuccess, verifyResponse.data.message);
        
        return verificationSuccess;
      } catch (verifyError) {
        logTest('OTP Verification', false, verifyError.response?.data?.message || verifyError.message);
        return false;
      }
    } catch (error) {
      logTest('OTP Verification', false, error.message);
      return false;
    }
  }
};

// Main test runner
async function runAllTests() {
  log(colors.bright + colors.magenta, '\n🚀 Starting Comprehensive OTP and Database Tests');
  log(colors.cyan, `Base URL: ${BASE_URL}`);
  log(colors.cyan, `Test User: ${TEST_USER.email}`);
  
  const results = {
    health: false,
    database: false,
    existingOTPs: false,
    otpCreation: false,
    registration: false,
    verification: false
  };
  
  try {
    // Run tests in sequence
    results.health = await tests.testHealth();
    if (!results.health) {
      log(colors.red, '\n❌ Health check failed. Server may not be running.');
      return;
    }
    
    results.database = await tests.testDatabaseDebug();
    results.existingOTPs = await tests.testExistingOTPs();
    results.otpCreation = await tests.testOTPCreation();
    results.registration = await tests.testUserRegistration();
    results.verification = await tests.testOTPVerification();
    
  } catch (error) {
    log(colors.red, `\n❌ Test execution error: ${error.message}`);
  }
  
  // Summary
  log(colors.bright + colors.magenta, '\n📊 Test Results Summary');
  log(colors.cyan, '=====================================');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? colors.green : colors.red;
    log(color, `${status} - ${test.charAt(0).toUpperCase() + test.slice(1)}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  log(colors.bright + colors.magenta, `\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    log(colors.bright + colors.green, '\n🎉 All tests passed! OTP system is working correctly.');
  } else {
    log(colors.bright + colors.red, '\n⚠️ Some tests failed. Check the details above.');
  }
  
  // Recommendations
  log(colors.bright + colors.yellow, '\n💡 Recommendations:');
  if (!results.health) {
    log(colors.yellow, '   - Make sure your server is running on port 5000');
    log(colors.yellow, '   - Check if MongoDB is connected');
  }
  if (!results.database) {
    log(colors.yellow, '   - Check database connection');
    log(colors.yellow, '   - Verify OTP model is properly defined');
  }
  if (!results.otpCreation) {
    log(colors.yellow, '   - Check OTP model validation');
    log(colors.yellow, '   - Verify database permissions');
  }
  if (!results.registration) {
    log(colors.yellow, '   - Check user registration logic');
    log(colors.yellow, '   - Verify email service configuration');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    log(colors.red, `\n💥 Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { tests, runAllTests };
