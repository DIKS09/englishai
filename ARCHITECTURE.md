# 🏗 Архитектура проекта

## 📊 Общая структура

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │ ◄─────► │   Express   │ ◄─────► │   MongoDB   │
│  Frontend   │  HTTP   │   Backend   │  CRUD   │    Atlas    │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │   OpenAI    │
                        │     API     │
                        └─────────────┘
```

## 🎨 Frontend (React)

### Структура компонентов:

```
src/
├── App.js                      # Главный компонент, роутинг функций
├── components/
│   ├── Header.js              # Шапка сайта с логотипом
│   ├── FeatureCard.js         # Карточка функции на главной
│   ├── EssayGenerator.js      # Компонент генератора эссе
│   ├── DialogueGenerator.js   # Компонент генератора диалогов
│   └── FillBlankGenerator.js  # Компонент упражнений
└── styles/
    ├── index.css              # Глобальные стили
    ├── App.css                # Стили главного компонента
    ├── Header.css             # Стили шапки
    ├── FeatureCard.css        # Стили карточек
    └── Generator.css          # Общие стили для генераторов
```

### Потоки данных:

```
User Input → Component State → Axios Request → Backend API
                                                    ↓
User Display ← Component State ← Response ← Backend API
```

### Основные технологии:
- **React 18**: Функциональные компоненты + Hooks
- **Axios**: HTTP клиент для API запросов
- **CSS3**: Кастомные стили с градиентами и анимациями
- **React Icons**: Иконки для UI

### State Management:
- **Local State (useState)**: Для форм и UI состояний
- **Loading States**: Отображение процесса загрузки
- **Error Handling**: Обработка и отображение ошибок

## 🔧 Backend (Node.js + Express)

### Структура:

```
backend/
├── server.js              # Точка входа, настройка Express
├── models/
│   └── History.js        # Mongoose модель для истории
├── routes/
│   ├── essayRoutes.js    # Эндпоинты для генератора эссе
│   ├── dialogueRoutes.js # Эндпоинты для диалогов
│   ├── fillBlankRoutes.js # Эндпоинты для упражнений
│   └── historyRoutes.js  # Эндпоинты для истории
└── services/
    └── openaiService.js  # Сервис работы с OpenAI API
```

### API Endpoints:

#### 1. Генератор эссе
```
POST /api/essay/generate
Request: { keyword: string }
Response: { topics: Topic[] }
```

#### 2. Генератор диалогов
```
POST /api/dialogue/generate
Request: { topic: string, level: 'easy' | 'medium' | 'hard' }
Response: { dialogue: Dialogue }
```

#### 3. Упражнения "Заполни пропуск"
```
POST /api/fill-blank/generate
Request: { grammar: string, count: number }
Response: { exercises: Exercise[] }
```

#### 4. История
```
GET /api/history?type=essay&limit=20
DELETE /api/history/:id
```

#### 5. Health Check
```
GET /api/health
Response: { status: 'OK', message: 'Server is running' }
```

### Middleware Stack:

```
Request
  ↓
CORS (разрешение кросс-доменных запросов)
  ↓
Body Parser (парсинг JSON)
  ↓
Route Handler (обработка запроса)
  ↓
OpenAI Service (генерация контента)
  ↓
MongoDB (сохранение в базу)
  ↓
Response
```

## 🗄 База данных (MongoDB Atlas)

### Коллекция: `histories`

```javascript
{
  _id: ObjectId,
  type: 'essay' | 'dialogue' | 'fill-blank',
  input: {
    keyword?: string,
    topic?: string,
    level?: string,
    grammar?: string,
    count?: number
  },
  output: Object,  // Результат генерации
  createdAt: Date
}
```

### Индексы:
- `type`: Для быстрой фильтрации по типу
- `createdAt`: Для сортировки по времени

### Преимущества MongoDB Atlas:
- ☁️ Облачное хранилище
- 🔄 Автоматическое резервное копирование
- 📊 Встроенная аналитика
- 🔒 Безопасность на уровне кластера

## 🤖 OpenAI Integration

### Сервис: `openaiService.js`

```javascript
// Три основные функции:
- generateEssayTopics(keyword)
- generateDialogue(topic, level)
- generateFillBlanks(grammar, count)
```

### Конфигурация промптов:

#### 1. Essay Topics:
```
System: "You are an English teacher..."
User: "Generate 5 essay topics about {keyword}"
Model: gpt-3.5-turbo
Temperature: 0.8 (для креативности)
```

#### 2. Dialogues:
```
System: "You are an English teacher..."
User: "Create a dialogue about {topic} at {level} level"
Model: gpt-3.5-turbo
Temperature: 0.7 (баланс)
```

#### 3. Fill Blanks:
```
System: "You are an English teacher..."
User: "Create {count} fill-in-the-blank exercises for {grammar}"
Model: gpt-3.5-turbo
Temperature: 0.7
```

### Error Handling:
- ✅ Try-catch блоки
- ✅ Fallback данные при ошибках
- ✅ Логирование ошибок
- ✅ Понятные сообщения пользователю

## 🔐 Безопасность

### Environment Variables (.env):
```
MONGODB_URI      # Строка подключения к БД
OPENAI_API_KEY   # API ключ OpenAI
PORT             # Порт сервера
NODE_ENV         # Окружение (dev/prod)
```

### Защита:
- 🔒 `.env` в `.gitignore`
- 🔒 CORS настроен для безопасности
- 🔒 Валидация входных данных
- 🔒 Ограничение доступа к MongoDB

## 📈 Масштабируемость

### Текущие возможности:
- ⚡ Обработка ~100 запросов/минуту
- 💾 512 МБ данных (MongoDB Free Tier)
- 🔄 Автоматическое восстановление соединений

### Возможности для роста:
1. **Кэширование**: Redis для часто запрашиваемого контента
2. **Load Balancing**: Несколько инстансов backend
3. **CDN**: Для статических файлов frontend
4. **Rate Limiting**: Ограничение запросов на пользователя
5. **WebSockets**: Для real-time обновлений

## 🎯 Производительность

### Frontend:
- ⚡ Code Splitting: Загрузка компонентов по требованию
- 🎨 CSS оптимизация: Минимизация и группировка
- 📦 Production Build: Минификация и сжатие

### Backend:
- ⚡ Async/Await: Неблокирующие операции
- 📊 Connection Pooling: Эффективное использование MongoDB
- 🔄 Error Recovery: Автоматическое переподключение

## 🧪 Тестирование (будущее развитие)

### Frontend:
```
- Unit Tests: Jest + React Testing Library
- Integration Tests: Cypress
- E2E Tests: Playwright
```

### Backend:
```
- Unit Tests: Jest
- API Tests: Supertest
- Load Tests: Artillery
```

## 📱 Адаптивность

### Брейкпоинты:
- 📱 Mobile: < 768px
- 💻 Tablet: 768px - 1024px
- 🖥 Desktop: > 1024px

### Подход:
- Mobile-First Design
- Flexible Grid Layout
- Touch-Friendly Buttons
- Responsive Typography

## 🚀 Deployment (рекомендации)

### Frontend:
- Vercel
- Netlify
- GitHub Pages

### Backend:
- Heroku
- Railway
- Render

### Database:
- MongoDB Atlas (уже облачное)

---

**Архитектура спроектирована для легкой поддержки и масштабирования! 🎉**

