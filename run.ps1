# MedFlow - Script de Execucao
Write-Host "Iniciando MedFlow..." -ForegroundColor Green

if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "Java nao encontrado. Instale o JDK 17+" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js nao encontrado. Instale o Node.js 18+ (https://nodejs.org)" -ForegroundColor Red
    exit 1
}

Write-Host "Iniciando servicos Docker..." -ForegroundColor Yellow
docker-compose -f .\backend\src\main\docker\docker-compose.yml up -d

Write-Host "Aguardando servicos iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Buildando backend..." -ForegroundColor Yellow
cd backend
mvn clean install -DskipTests
cd ..

Write-Host "Iniciando backend..." -ForegroundColor Yellow
Start-Process -WindowStyle Hidden -FilePath "cmd" -ArgumentList "/c cd backend && mvn spring-boot:run"

Write-Host "Instalando dependencias do frontend (primeira execucao pode demorar)..." -ForegroundColor Yellow
cd frontend-web
if (-not (Test-Path "node_modules")) {
    npm install
}
cd ..

Write-Host "Iniciando frontend web..." -ForegroundColor Yellow
Start-Process -WindowStyle Hidden -FilePath "cmd" -ArgumentList "/c cd frontend-web && npm run dev"

Write-Host "Aguardando frontend subir..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "MedFlow iniciado com sucesso!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "Credenciais: admin / admin123" -ForegroundColor Yellow
