#!/usr/bin/env node

/**
 * Скрипт проверки окружения
 * Проверяет наличие необходимых файлов и переменных
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка окружения для EnglishAI...\n');

let hasErrors = false;

// Проверка Node.js версии
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

console.log(`📦 Node.js версия: ${nodeVersion}`);
if (majorVersion < 14) {
  console.error('❌ Требуется Node.js версия 14 или выше!');
  hasErrors = true;
} else {
  console.log('✅ Node.js версия подходит\n');
}

// Проверка package.json
console.log('📄 Проверка package.json файлов...');
const rootPackage = path.join(__dirname, 'package.json');
const frontendPackage = path.join(__dirname, 'frontend', 'package.json');

if (fs.existsSync(rootPackage)) {
  console.log('✅ Корневой package.json найден');
} else {
  console.error('❌ Корневой package.json не найден!');
  hasErrors = true;
}

if (fs.existsSync(frontendPackage)) {
  console.log('✅ Frontend package.json найден\n');
} else {
  console.error('❌ Frontend package.json не найден!\n');
  hasErrors = true;
}

// Проверка node_modules
console.log('📦 Проверка зависимостей...');
const rootModules = path.join(__dirname, 'node_modules');
const frontendModules = path.join(__dirname, 'frontend', 'node_modules');

if (fs.existsSync(rootModules)) {
  console.log('✅ Backend зависимости установлены');
} else {
  console.error('⚠️  Backend зависимости не установлены. Запустите: npm install');
  hasErrors = true;
}

if (fs.existsSync(frontendModules)) {
  console.log('✅ Frontend зависимости установлены\n');
} else {
  console.error('⚠️  Frontend зависимости не установлены. Запустите: cd frontend && npm install\n');
  hasErrors = true;
}

// Проверка .env файла
console.log('🔐 Проверка файла .env...');
const envFile = path.join(__dirname, '.env');

if (fs.existsSync(envFile)) {
  console.log('✅ Файл .env найден');
  
  // Читаем и проверяем переменные
  const envContent = fs.readFileSync(envFile, 'utf-8');
  const requiredVars = ['MONGODB_URI', 'OPENAI_API_KEY', 'PORT'];
  
  requiredVars.forEach(varName => {
    const regex = new RegExp(`^${varName}=.+$`, 'm');
    if (regex.test(envContent)) {
      const value = envContent.match(regex)[0].split('=')[1];
      if (value && !value.includes('your') && !value.includes('ваш')) {
        console.log(`✅ ${varName} установлен`);
      } else {
        console.error(`⚠️  ${varName} не настроен (содержит placeholder)`);
        hasErrors = true;
      }
    } else {
      console.error(`❌ ${varName} отсутствует в .env`);
      hasErrors = true;
    }
  });
} else {
  console.error('❌ Файл .env не найден!');
  console.log('📝 Создайте файл .env на основе .env.example');
  hasErrors = true;
}

console.log('\n📁 Проверка структуры проекта...');

// Проверка backend файлов
const backendFiles = [
  'backend/server.js',
  'backend/models/History.js',
  'backend/routes/essayRoutes.js',
  'backend/routes/dialogueRoutes.js',
  'backend/routes/fillBlankRoutes.js',
  'backend/services/openaiService.js'
];

backendFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ ${file} не найден`);
    hasErrors = true;
  }
});

// Проверка frontend файлов
const frontendFiles = [
  'frontend/src/index.js',
  'frontend/src/App.js',
  'frontend/public/index.html'
];

frontendFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ ${file} не найден`);
    hasErrors = true;
  }
});

// Итоговый результат
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Обнаружены проблемы с окружением!');
  console.log('📖 Смотрите SETUP.md для инструкций по настройке');
  process.exit(1);
} else {
  console.log('✅ Все проверки пройдены успешно!');
  console.log('🚀 Проект готов к запуску!');
  console.log('\n💡 Запустите проект командой: npm run dev:all');
  process.exit(0);
}

