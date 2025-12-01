# 🚀 Руководство по развертыванию

## 📦 Развертывание в production

### Вариант 1: Vercel (Frontend) + Render (Backend)

#### Frontend на Vercel

1. **Подготовка**:
```bash
cd frontend
npm run build
```

2. **Vercel Dashboard**:
   - Зарегистрируйтесь на [vercel.com](https://vercel.com)
   - Нажмите "New Project"
   - Импортируйте репозиторий
   - Root Directory: `frontend`
   - Framework: Create React App
   - Deploy

3. **Переменные окружения**:
   - Settings → Environment Variables
   - Добавьте: `REACT_APP_API_URL=https://ваш-backend.onrender.com`

#### Backend на Render

1. **Render Dashboard**:
   - Зарегистрируйтесь на [render.com](https://render.com)
   - New → Web Service
   - Подключите GitHub репозиторий
   - Root Directory: оставьте пустым
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Переменные окружения**:
   ```
   MONGODB_URI=ваша_строка_mongodb
   OPENAI_API_KEY=ваш_ключ_openai
   PORT=5000
   NODE_ENV=production
   ```

3. **Настройки CORS**:
   В `backend/server.js` добавьте:
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'https://ваш-frontend.vercel.app'
   ];

   app.use(cors({
     origin: function(origin, callback) {
       if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     }
   }));
   ```

---

### Вариант 2: Netlify (Frontend) + Railway (Backend)

#### Frontend на Netlify

1. **Подготовка**:
```bash
cd frontend
npm run build
```

2. **Netlify**:
   - Зарегистрируйтесь на [netlify.com](https://netlify.com)
   - New site from Git
   - Выберите репозиторий
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

3. **Environment Variables**:
   - Site settings → Build & deploy → Environment
   - `REACT_APP_API_URL=https://ваш-backend.up.railway.app`

#### Backend на Railway

1. **Railway Dashboard**:
   - Зарегистрируйтесь на [railway.app](https://railway.app)
   - New Project → Deploy from GitHub repo
   - Выберите репозиторий

2. **Настройки**:
   - Root Directory: оставьте пустым
   - Start Command: `npm start`

3. **Variables**:
   ```
   MONGODB_URI=ваша_строка
   OPENAI_API_KEY=ваш_ключ
   NODE_ENV=production
   ```

---

### Вариант 3: Heroku (Full Stack)

#### Подготовка проекта

1. **Создайте файл `Procfile` в корне**:
```
web: npm start
```

2. **Обновите `package.json`**:
```json
{
  "scripts": {
    "start": "node backend/server.js",
    "heroku-postbuild": "cd frontend && npm install && npm run build"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

3. **Настройте Express для обслуживания статики**:
```javascript
// В backend/server.js добавьте:
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}
```

#### Деплой на Heroku

```bash
# Установите Heroku CLI
# Windows: скачайте с https://devcenter.heroku.com/articles/heroku-cli

# Логин
heroku login

# Создайте приложение
heroku create ваше-имя-приложения

# Добавьте переменные окружения
heroku config:set MONGODB_URI="ваша_строка"
heroku config:set OPENAI_API_KEY="ваш_ключ"
heroku config:set NODE_ENV=production

# Деплой
git push heroku main

# Откройте приложение
heroku open
```

---

## 🔒 Безопасность в Production

### 1. Переменные окружения
- ✅ Никогда не коммитьте .env
- ✅ Используйте разные ключи для dev и prod
- ✅ Регулярно ротируйте API ключи

### 2. CORS
```javascript
// Только разрешенные домены
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### 3. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // макс 100 запросов
});

app.use('/api/', limiter);
```

### 4. Helmet.js для безопасности
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## 📊 Мониторинг

### 1. Логирование
```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

### 2. Error tracking
- Sentry.io
- LogRocket
- Bugsnag

### 3. Uptime monitoring
- UptimeRobot
- Pingdom
- Better Uptime

---

## 🔧 Оптимизация Production

### Frontend

1. **Code Splitting**:
```javascript
const EssayGenerator = lazy(() => import('./components/EssayGenerator'));
```

2. **Image Optimization**:
- Используйте WebP
- Lazy loading для изображений

3. **Bundle Analysis**:
```bash
npm run build -- --stats
npx webpack-bundle-analyzer build/bundle-stats.json
```

### Backend

1. **Compression**:
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Caching**:
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });
```

3. **Database Indexing**:
```javascript
// В модели History
historySchema.index({ type: 1, createdAt: -1 });
```

---

## 🧪 Pre-deployment Checklist

### Код
- [ ] Все зависимости установлены
- [ ] Нет console.log в production коде
- [ ] Error handling реализован
- [ ] API endpoints протестированы
- [ ] CORS настроен правильно

### Безопасность
- [ ] .env не в репозитории
- [ ] API ключи валидны
- [ ] MongoDB доступна из production
- [ ] HTTPS настроен
- [ ] Rate limiting включен

### Производительность
- [ ] Frontend собран для production
- [ ] Images оптимизированы
- [ ] Gzip/Brotli compression включен
- [ ] Database indexes созданы

### Мониторинг
- [ ] Логирование настроено
- [ ] Error tracking подключен
- [ ] Uptime monitoring активен
- [ ] Analytics подключена (опционально)

---

## 🆘 Troubleshooting в Production

### Проблема: 502 Bad Gateway
**Решение**: 
- Проверьте логи backend
- Убедитесь что PORT правильный
- Проверьте health endpoint

### Проблема: CORS ошибки
**Решение**:
- Добавьте frontend URL в allowedOrigins
- Проверьте что credentials правильно настроены

### Проблема: OpenAI timeout
**Решение**:
- Увеличьте timeout в axios
- Добавьте retry логику
- Проверьте баланс OpenAI

### Проблема: MongoDB connection failed
**Решение**:
- Проверьте IP whitelist в MongoDB Atlas
- Убедитесь что строка подключения правильная
- Проверьте что пароль не содержит спецсимволы

---

## 📈 Scaling

### Horizontal Scaling
- Несколько инстансов backend за load balancer
- Redis для session management
- CDN для статических файлов

### Vertical Scaling
- Больше RAM/CPU для backend
- MongoDB cluster вместо single instance
- Dedicated OpenAI account с higher limits

---

## 💡 Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
- [Heroku Documentation](https://devcenter.heroku.com)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

---

**Успешного деплоя! 🚀**

