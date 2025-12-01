@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════════
echo    Загрузка на GitHub: https://github.com/DIKS09/englishai
echo ════════════════════════════════════════════════════════
echo.

echo [1/8] Очистка .git папок...
if exist .git rmdir /s /q .git 2>nul
if exist frontend\.git rmdir /s /q frontend\.git 2>nul
if exist backend\.git rmdir /s /q backend\.git 2>nul
echo ✓ Очищено
echo.

echo [2/8] Инициализация Git...
git init
if errorlevel 1 (
    echo ✗ Git не установлен! Скачайте: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✓ Готово
echo.

echo [3/8] Настройка Git...
git config user.name "DIKS09"
git config user.email "diks09@github.com"
echo ✓ Готово
echo.

echo [4/8] Добавление файлов...
git add .
echo ✓ Готово
echo.

echo [5/8] Создание коммита...
git commit -m "Add full EnglishAI project: React frontend, Node.js backend, AI integration"
echo ✓ Готово
echo.

echo [6/8] Подключение к репозиторию...
git remote remove origin 2>nul
git remote add origin https://github.com/DIKS09/englishai.git
echo ✓ Готово
echo.

echo [7/8] Переименование ветки...
git branch -M main
echo ✓ Готово
echo.

echo [8/8] Загрузка на GitHub...
echo.
echo ════════════════════════════════════════════════════════
echo  ВАЖНО: Сейчас нужно ввести данные для GitHub
echo ════════════════════════════════════════════════════════
echo.
echo Username: DIKS09
echo Password: Ваш пароль или Personal Access Token
echo.
echo Если пароль НЕ работает:
echo 1. Откройте: https://github.com/settings/tokens
echo 2. Generate new token (classic)
echo 3. Права: repo (все галочки)
echo 4. Скопируйте токен
echo 5. Используйте токен вместо пароля
echo.
pause

git push -u origin main

if errorlevel 1 (
    echo.
    echo ════════════════════════════════════════════════════════
    echo  ✗ ОШИБКА ПРИ ЗАГРУЗКЕ
    echo ════════════════════════════════════════════════════════
    echo.
    echo Создайте Personal Access Token:
    echo https://github.com/settings/tokens
    echo.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════
echo  ✓ УСПЕШНО! ВСЁ ЗАГРУЖЕНО!
echo ════════════════════════════════════════════════════════
echo.
echo Проверьте: https://github.com/DIKS09/englishai
echo.
echo СЛЕДУЮЩИЙ ШАГ:
echo Откройте: ИНСТРУКЦИЯ_ВСЁ_В_ОДНОМ.md
echo Переходите к ЧАСТИ 2 (MongoDB Atlas)
echo.
pause

