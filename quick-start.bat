@echo off
echo 🎬 Interactive Video Form - Quick Start Script
echo ==============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Setting up environment variables...

:: Create .env.local if it doesn't exist
if not exist .env.local (
    copy .env.local.example .env.local
    echo ✅ Created .env.local file
    echo ⚠️  Please edit .env.local with your MongoDB URI and Google Calendar URL
) else (
    echo ✅ .env.local already exists
)

echo.
echo 🎥 Next Steps:
echo.
echo 1. Add your video URLs in src/config/formSteps.ts
echo 2. Configure MongoDB URI in .env.local
echo 3. (Optional) Add Google Calendar URL in .env.local
echo.
echo 4. Start the development server:
echo    npm run dev
echo.
echo 5. Open http://localhost:3000 in your browser
echo.
echo 📚 Documentation:
echo    - README.md - Overview and basic setup
echo    - docs/DEPLOYMENT.md - Deployment guide
echo    - docs/CUSTOMIZATION.md - Customization guide
echo.
echo 🚀 Ready to start? Run: npm run dev
echo.
pause
