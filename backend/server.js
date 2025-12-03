const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const essayRoutes = require('./routes/essayRoutes');
const dialogueRoutes = require('./routes/dialogueRoutes');
const fillBlankRoutes = require('./routes/fillBlankRoutes');
const historyRoutes = require('./routes/historyRoutes');
const grammarRoutes = require('./routes/grammarRoutes');
const storyRoutes = require('./routes/storyRoutes');
const paraphraseRoutes = require('./routes/paraphraseRoutes');
const errorHuntRoutes = require('./routes/errorHuntRoutes');
const levelTestRoutes = require('./routes/levelTestRoutes');

app.use('/api/essay', essayRoutes);
app.use('/api/dialogue', dialogueRoutes);
app.use('/api/fill-blank', fillBlankRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/paraphrase', paraphraseRoutes);
app.use('/api/error-hunt', errorHuntRoutes);
app.use('/api/level-test', levelTestRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

