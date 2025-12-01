@echo off
chcp 65001 >nul
echo ════════════════════════════════════════════════════════
echo    Настройка Git и загрузка проекта на GitHub
echo ════════════════════════════════════════════════════════
echo.

REM Удаляем старые .git папки если есть
if exist .git rmdir /s /q .git
if exist frontend\.git rmdir /s /q frontend\.git

echo [1/6] Инициализация Git репозитория...
git init
if errorlevel 1 (
    echo ОШИБКА: Git не установлен! Скачайте с https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [2/6] Настройка Git конфигурации...
echo Введите ваше имя для Git:
set /p GIT_NAME="Имя: "
git config user.name "%GIT_NAME%"

echo Введите ваш email для Git:
set /p GIT_EMAIL="Email: "
git config user.email "%GIT_EMAIL%"

echo [3/6] Добавление файлов в Git...
git add .

echo [4/6] Создание первого коммита...
git commit -m "Initial commit: EnglishAI - AI-powered English learning platform"

echo.
echo ════════════════════════════════════════════════════════
echo    ТЕПЕРЬ СОЗДАЙТЕ РЕПОЗИТОРИЙ НА GITHUB:
echo ════════════════════════════════════════════════════════
echo.
echo 1. Откройте: https://github.com/new
echo 2. Repository name: englishai
echo 3. Description: AI-powered English learning platform
echo 4. Выберите: Public
echo 5. НЕ ставьте галочки на README и .gitignore
echo 6. Нажмите "Create repository"
echo.
echo После создания репозитория вернитесь сюда и продолжите...
echo.
pause

echo.
echo Введите ваш username на GitHub:
set /p GITHUB_USER="Username: "

echo [5/6] Подключение к GitHub репозиторию...
git remote add origin https://github.com/%GITHUB_USER%/englishai.git
git branch -M main

echo [6/6] Отправка кода на GitHub...
echo Сейчас откроется окно для ввода логина и пароля GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ════════════════════════════════════════════════════════
    echo ОШИБКА: Не удалось загрузить на GitHub
    echo ════════════════════════════════════════════════════════
    echo.
    echo Возможные причины:
    echo 1. Неправильный username
    echo 2. Неправильный пароль/токен
    echo 3. Репозиторий не был создан на GitHub
    echo.
    echo Попробуйте еще раз командой: git push -u origin main
    echo.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════
echo    ✓ УСПЕШНО! КОД ЗАГРУЖЕН НА GITHUB
echo ════════════════════════════════════════════════════════
echo.
echo Ваш репозиторий: https://github.com/%GITHUB_USER%/englishai
echo.
echo Откройте эту ссылку в браузере чтобы убедиться!
echo.
echo СЛЕДУЮЩИЙ ШАГ: Откройте файл ДЕПЛОЙ_НА_RENDER.md
echo и следуйте инструкциям начиная с ЧАСТИ 5
echo.
pause

