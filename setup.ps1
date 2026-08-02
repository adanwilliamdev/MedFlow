# MedFlow - Script de Configuracao Inicial
Write-Host "Configurando MedFlow..." -ForegroundColor Green

$tools = @{
    "Java" = "java -version"
    "Maven" = "mvn -version"
    "Docker" = "docker --version"
    "Node.js" = "node -v"
    "npm" = "npm -v"
}

foreach ($tool in $tools.Keys) {
    try {
        $result = Invoke-Expression $tools[$tool] 2>&1
        Write-Host "$tool instalado" -ForegroundColor Green
    } catch {
        Write-Host "$tool nao encontrado" -ForegroundColor Red
    }
}

Write-Host "Configuracao concluida!" -ForegroundColor Green
Write-Host "Execute '.\run.ps1' para iniciar o sistema" -ForegroundColor Cyan
