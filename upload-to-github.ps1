# Скрипт для загрузки на GitHub
$ErrorActionPreference = "Continue"

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Загрузка EnglishAI на GitHub" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Получаем текущую директорию
$projectPath = Get-Location

Write-Host "[1/8] Очистка старых .git папок..." -ForegroundColor Yellow
Remove-Item -Recurse -Force ".git" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "frontend\.git" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "backend\.git" -ErrorAction SilentlyContinue
Write-Host "✓ Очищено" -ForegroundColor Green
Write-Host ""

Write-Host "[2/8] Инициализация Git..." -ForegroundColor Yellow
git init
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Ошибка: Git не установлен!" -ForegroundColor Red
    Write-Host "Скачайте Git с https://git-scm.com/download/win" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Git инициализирован" -ForegroundColor Green
Write-Host ""

Write-Host "[3/8] Настройка Git конфигурации..." -ForegroundColor Yellow
$gitName = git config user.name
if ([string]::IsNullOrEmpty($gitName)) {
    git config user.name "DIKS09"
    Write-Host "✓ Установлено имя: DIKS09" -ForegroundColor Green
} else {
    Write-Host "✓ Имя уже установлено: $gitName" -ForegroundColor Green
}

$gitEmail = git config user.email
if ([string]::IsNullOrEmpty($gitEmail)) {
    git config user.email "diks09@github.com"
    Write-Host "✓ Установлен email: diks09@github.com" -ForegroundColor Green
} else {
    Write-Host "✓ Email уже установлен: $gitEmail" -ForegroundColor Green
}
Write-Host ""

Write-Host "[4/8] Добавление файлов..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Ошибка при добавлении файлов" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Файлы добавлены" -ForegroundColor Green
Write-Host ""

Write-Host "[5/8] Создание коммита..." -ForegroundColor Yellow
git commit -m "Add full EnglishAI project with backend, frontend and documentation"
Write-Host "✓ Коммит создан" -ForegroundColor Green
Write-Host ""

Write-Host "[6/8] Подключение к GitHub репозиторию..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/DIKS09/englishai.git
Write-Host "✓ Репозиторий подключен" -ForegroundColor Green
Write-Host ""

Write-Host "[7/8] Переименование ветки в main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Ветка переименована" -ForegroundColor Green
Write-Host ""

Write-Host "[8/8] Загрузка на GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "ВНИМАНИЕ: Сейчас нужно будет ввести данные GitHub:" -ForegroundColor Cyan
Write-Host "Username: DIKS09" -ForegroundColor Cyan
Write-Host "Password: Ваш пароль или Personal Access Token" -ForegroundColor Cyan
Write-Host ""
Write-Host "Если пароль не работает, создайте Personal Access Token:" -ForegroundColor Yellow
Write-Host "1. https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host "2. Generate new token (classic)" -ForegroundColor Yellow
Write-Host "3. Выберите права: repo (все галочки)" -ForegroundColor Yellow
Write-Host "4. Скопируйте токен и используйте его вместо пароля" -ForegroundColor Yellow
Write-Host ""
pause

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "   ✓ УСПЕШНО! КОД ЗАГРУЖЕН НА GITHUB!" -ForegroundColor Green
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ваш репозиторий: https://github.com/DIKS09/englishai" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Откройте эту ссылку в браузере чтобы проверить!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "СЛЕДУЮЩИЙ ШАГ:" -ForegroundColor Yellow
    Write-Host "Откройте файл ИНСТРУКЦИЯ_ВСЁ_В_ОДНОМ.md" -ForegroundColor Yellow
    Write-Host "и переходите к ЧАСТИ 2 (MongoDB Atlas)" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "   ✗ ОШИБКА ПРИ ЗАГРУЗКЕ" -ForegroundColor Red
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host "Возможные причины:" -ForegroundColor Yellow
    Write-Host "1. Неправильный пароль/токен" -ForegroundColor Yellow
    Write-Host "2. Нет прав доступа к репозиторию" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Попробуйте еще раз или используйте Personal Access Token" -ForegroundColor Yellow
    Write-Host "https://github.com/settings/tokens" -ForegroundColor Cyan
    Write-Host ""
}

pause

