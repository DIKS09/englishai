@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════════
echo    Исправление Git ошибки
echo ════════════════════════════════════════════════════════
echo.

echo [1/4] Удаление вложенных .git папок...
if exist .git\. (
    echo Найдена .git в корне - оставляем
) else (
    echo Нет .git в корне - это нормально
)

if exist frontend\.git\. (
    echo Удаляем frontend\.git...
    rmdir /s /q frontend\.git
    echo ✓ Удалено
) else (
    echo frontend\.git не найдена
)

if exist backend\.git\. (
    echo Удаляем backend\.git...
    rmdir /s /q backend\.git
    echo ✓ Удалено
) else (
    echo backend\.git не найдена
)

echo.
echo [2/4] Очистка Git кеша...
git rm -r --cached . 2>nul
echo ✓ Кеш очищен

echo.
echo [3/4] Добавление всех файлов заново...
git add .
if errorlevel 1 (
    echo ✗ Ошибка при добавлении файлов
    echo.
    echo Попробуйте вручную:
    echo 1. rmdir /s /q frontend\.git
    echo 2. git rm -r --cached .
    echo 3. git add .
    echo.
    pause
    exit /b 1
)
echo ✓ Файлы добавлены

echo.
echo [4/4] Создание коммита...
git commit -m "Initial commit: EnglishAI project"
if errorlevel 1 (
    echo.
    echo Возможно коммит уже был создан ранее.
    echo Это нормально, продолжайте!
)

echo.
echo ════════════════════════════════════════════════════════
echo    ✓ ИСПРАВЛЕНО!
echo ════════════════════════════════════════════════════════
echo.
echo Теперь можно загружать на GitHub.
echo.
echo Выполните следующие команды:
echo.
echo git remote add origin https://github.com/ВАШ_USERNAME/englishai.git
echo git branch -M main
echo git push -u origin main
echo.
echo (Замените ВАШ_USERNAME на ваш username GitHub)
echo.
pause

