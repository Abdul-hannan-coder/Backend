@echo off
echo.
echo ========================================
echo    OTP Test Suite Runner
echo ========================================
echo.
echo This will test your OTP functionality and database connectivity
echo.
echo Prerequisites:
echo 1. Make sure your server is running on port 5000
echo 2. Make sure MongoDB is connected
echo.
echo Press any key to continue...
pause >nul

echo.
echo Installing test dependencies...
npm install axios

echo.
echo Running OTP tests...
node test-otp.js

echo.
echo Tests completed!
echo Press any key to exit...
pause >nul
