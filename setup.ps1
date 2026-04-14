Write-Host "Starting RecipeHunter setup..." -ForegroundColor Green

# 1. Check Node.js
<<<<<<< HEAD
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Installing via winget..." -ForegroundColor Yellow
=======
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Installing via winget..." -ForegroundColor Yellow
>>>>>>> b4c78c28d1489ec1d270c36fd5d07fd4a5d7ad8a
    winget install OpenJS.NodeJS.LTS -e --silent
} else {
    Write-Host "Node.js already installed" -ForegroundColor Green
}

# Check versions
node -v
npm -v

# 2. Install backend dependencies
<<<<<<< HEAD
Write-Host "`n Installing backend dependencies..." -ForegroundColor Cyan
cd backend
=======
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
>>>>>>> b4c78c28d1489ec1d270c36fd5d07fd4a5d7ad8a
npm install

# Install nodemon globally
npm install -g nodemon

# 3. Create .env if not exists
<<<<<<< HEAD
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    New-Item -Path ".env" -ItemType File | Out-Null
=======
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    New-Item .env -ItemType File | Out-Null
>>>>>>> b4c78c28d1489ec1d270c36fd5d07fd4a5d7ad8a

    Add-Content -Path ".env" -Value "PORT=5001"
    Add-Content -Path ".env" -Value "MONGO_URI=PASTE_YOUR_MONGO_URI_HERE"
}
else {
    Write-Host " .env already exists" -ForegroundColor Green
}

# 4. Install frontend dependencies
<<<<<<< HEAD
Write-Host "`n Installing frontend dependencies..." -ForegroundColor Cyan
cd ../frontend
=======
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location ../frontend
>>>>>>> b4c78c28d1489ec1d270c36fd5d07fd4a5d7ad8a
npm install

# Install required frontend packages
npm install axios react-router-dom

# 5. Install VS Code extensions
Write-Host "`n Installing VS Code extensions..." -ForegroundColor Cyan
code --install-extension rangav.vscode-thunder-client
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint

# 6. Go back to root
Set-Location ..

# 7. Open project in VS Code
Write-Host "`n Opening project in VS Code..." -ForegroundColor Green
code .

Write-Host "`n Setup complete!" -ForegroundColor Green
Write-Host " Next steps:" -ForegroundColor Cyan
Write-Host "1. Add MongoDB URI in backend/.env"
Write-Host "2. Run backend: cd backend && npm run dev"
Write-Host "3. Run frontend: cd frontend && npm run dev"