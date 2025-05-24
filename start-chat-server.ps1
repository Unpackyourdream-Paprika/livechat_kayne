# Bully 채팅 서버 시작 스크립트
Write-Host "🚀 Bully 채팅 서버 시작 중..." -ForegroundColor Green

# 현재 디렉토리 확인
$currentDir = Get-Location
Write-Host "📁 현재 디렉토리: $currentDir" -ForegroundColor Yellow

# 패키지 설치 확인
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 패키지를 설치합니다..." -ForegroundColor Yellow
    npm install
}

# .env 파일 확인
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env 파일이 없습니다. env.example을 참고하여 .env 파일을 생성해주세요." -ForegroundColor Red
    Write-Host "📄 env.example 파일 내용:" -ForegroundColor Yellow
    Get-Content "env.example"
    pause
    return
}

Write-Host "🌐 서버를 포트 3006에서 시작합니다..." -ForegroundColor Green
Write-Host "📊 Health Check: http://localhost:3006/health" -ForegroundColor Cyan
Write-Host "📈 Stats: http://localhost:3006/stats" -ForegroundColor Cyan
Write-Host "🛑 서버를 중지하려면 Ctrl+C를 누르세요." -ForegroundColor Yellow

# 서버 시작
npm run dev 