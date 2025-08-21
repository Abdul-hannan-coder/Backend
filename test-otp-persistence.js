const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  fullName: 'Persistence Test User',
  email: 'persistence@test.com',
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

const log = (color, message) => {
  console.log(`${color}${message}${colors.reset}`);
};

const logTest = (testName, success, details = '') => {
  const status = success ? '✅ PASS' : '❌ FAIL';
  const color = success ? colors.green : colors.red;
  log(color, `${status} - ${testName}`);
  if (details) {
    log(colors.cyan, `   Details: ${details}`);
  }
};

// Monitor OTP persistence
async function monitorOTPPersistence() {
  log(colors.bright + colors.magenta, '\n🔍 OTP Persistence Monitor');
  log(colors.cyan, '=====================================');
  
  try {
    // Step 1: Check initial state
    log(colors.blue, '\n📊 Step 1: Checking initial database state...');
    const initialResponse = await axios.get(`${BASE_URL}/api/v1/auth/test-otps`);
    const initialData = initialResponse.data.data;
    
    log(colors.cyan, `   Initial OTPs: ${initialData.otpCount}`);
    log(colors.cyan, `   Initial Users: ${initialData.userCount}`);
    
    // Step 2: Create a test user
    log(colors.blue, '\n📊 Step 2: Creating test user...');
    const registerResponse = await axios.post(`${BASE_URL}/api/v1/auth/register`, TEST_USER);
    
    if (registerResponse.data.success) {
      log(colors.green, `   ✅ User created: ${registerResponse.data.userId}`);
      
      // Step 3: Wait and check OTP creation
      log(colors.blue, '\n📊 Step 3: Waiting for OTP creation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const otpCheck1 = await axios.get(`${BASE_URL}/api/v1/auth/test-otps`);
      const otpData1 = otpCheck1.data.data;
      
      log(colors.cyan, `   OTPs after creation: ${otpData1.otpCount}`);
      
      if (otpData1.otpCount > 0) {
        const testUserOTP = otpData1.otps.find(otp => otp.user.email === TEST_USER.email);
        if (testUserOTP) {
          log(colors.green, `   ✅ OTP found: ${testUserOTP.code}`);
          log(colors.cyan, `   OTP ID: ${testUserOTP._id}`);
          log(colors.cyan, `   Expires: ${testUserOTP.expiresAt}`);
          
          // Step 4: Monitor OTP persistence over time
          log(colors.blue, '\n📊 Step 4: Monitoring OTP persistence...');
          
          for (let i = 1; i <= 6; i++) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            
            try {
              const otpCheck = await axios.get(`${BASE_URL}/api/v1/auth/test-otps`);
              const otpData = otpCheck.data.data;
              
              const currentOTP = otpData.otps.find(otp => otp._id === testUserOTP._id);
              
              if (currentOTP) {
                log(colors.green, `   ✅ OTP still exists after ${i * 5}s: ${currentOTP.code}`);
                log(colors.cyan, `   Time until expiration: ${Math.round((new Date(currentOTP.expiresAt) - new Date()) / 1000)}s`);
              } else {
                log(colors.red, `   ❌ OTP disappeared after ${i * 5}s!`);
                
                // Check if it was moved to a different collection or if there are any errors
                log(colors.yellow, `   🔍 Investigating OTP disappearance...`);
                
                // Check all collections for the OTP
                const allOTPs = otpData.otps;
                log(colors.cyan, `   Total OTPs in database: ${otpData.otpCount}`);
                
                if (allOTPs.length > 0) {
                  log(colors.yellow, `   Remaining OTPs:`);
                  allOTPs.forEach((otp, index) => {
                    log(colors.yellow, `     ${index + 1}. Code: ${otp.code}, User: ${otp.user.email}, Expires: ${otp.expiresAt}`);
                  });
                }
                
                break;
              }
            } catch (error) {
              log(colors.red, `   ❌ Error checking OTPs: ${error.message}`);
              break;
            }
          }
          
          // Step 5: Try to verify the OTP to see if it works
          log(colors.blue, '\n📊 Step 5: Testing OTP verification...');
          try {
            const verifyResponse = await axios.post(`${BASE_URL}/api/v1/auth/verify-otp`, {
              email: TEST_USER.email,
              otp: testUserOTP.code
            });
            
            if (verifyResponse.data.success) {
              log(colors.green, `   ✅ OTP verification successful: ${verifyResponse.data.message}`);
            } else {
              log(colors.red, `   ❌ OTP verification failed: ${verifyResponse.data.message}`);
            }
          } catch (verifyError) {
            log(colors.red, `   ❌ OTP verification error: ${verifyError.response?.data?.message || verifyError.message}`);
          }
          
        } else {
          log(colors.red, `   ❌ No OTP found for test user`);
        }
      } else {
        log(colors.red, `   ❌ No OTPs created`);
      }
      
    } else {
      log(colors.red, `   ❌ User creation failed: ${registerResponse.data.message}`);
    }
    
  } catch (error) {
    log(colors.red, `\n❌ Test error: ${error.message}`);
    if (error.response) {
      log(colors.red, `   Response: ${error.response.data.message || error.response.statusText}`);
    }
  }
  
  // Final check
  log(colors.blue, '\n📊 Final database state...');
  try {
    const finalResponse = await axios.get(`${BASE_URL}/api/v1/auth/test-otps`);
    const finalData = finalResponse.data.data;
    
    log(colors.cyan, `   Final OTPs: ${finalData.otpCount}`);
    log(colors.cyan, `   Final Users: ${finalData.userCount}`);
    
    if (finalData.otpCount > 0) {
      log(colors.yellow, `   Remaining OTPs:`);
      finalData.otps.forEach((otp, index) => {
        log(colors.yellow, `     ${index + 1}. Code: ${otp.code}, User: ${otp.user.email}, Expires: ${otp.expiresAt}`);
      });
    }
  } catch (error) {
    log(colors.red, `   ❌ Final check error: ${error.message}`);
  }
}

// Run the persistence monitor
monitorOTPPersistence().catch(error => {
  log(colors.red, `\n💥 Fatal error: ${error.message}`);
  process.exit(1);
});
