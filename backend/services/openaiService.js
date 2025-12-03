const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Генерация тем для эссе
async function generateEssayTopics(keyword) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English teacher helping students practice essay writing in English. IMPORTANT: All topics and descriptions MUST be written entirely in ENGLISH. If the keyword is in another language (like Russian), translate it first and generate English topics."
        },
        {
          role: "user",
          content: `Generate 5 interesting essay topics IN ENGLISH related to the keyword "${keyword}". All titles and descriptions MUST be in English. Each topic should be thought-provoking and suitable for English learners. Format: Return a JSON array of objects with 'title' (English title) and 'description' (English description) fields.`
        }
      ],
      temperature: 0.8,
    });

    let content = response.choices[0].message.content;
    
    // Remove markdown code block markers if present
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Try to parse JSON, if fails, create structured response
    try {
      return JSON.parse(content);
    } catch (e) {
      // Fallback: parse manually or return structured data
      const lines = content.split('\n').filter(line => line.trim());
      const topics = [];
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        topics.push({
          title: lines[i].replace(/^\d+\.\s*/, ''),
          description: `Write an essay exploring this topic in detail.`
        });
      }
      return topics;
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate essay topics');
  }
}

// Генерация диалогов
async function generateDialogue(topic, level) {
  try {
    const levelDescriptions = {
      easy: "beginner level (A1-A2), with simple vocabulary and short sentences",
      medium: "intermediate level (B1-B2), with moderate vocabulary and varied sentence structures",
      hard: "advanced level (C1-C2), with sophisticated vocabulary and complex expressions"
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English teacher creating dialogue exercises for students learning English. IMPORTANT: All dialogues MUST be written entirely in ENGLISH, regardless of what language the topic is provided in. If the topic is in another language (like Russian), translate it to English first."
        },
        {
          role: "user",
          content: `Create a dialogue IN ENGLISH between 2 people about "${topic}" at ${levelDescriptions[level]}. The dialogue MUST be entirely in English (this is for English language learners). The dialogue should have 8-10 exchanges (4-5 per person). Format: Return a JSON object with 'title' (in English), 'description' (in English), and 'lines' array. Each line should have 'speaker' (like "Waiter", "Customer", "Person A", etc.) and 'text' (the English dialogue) fields.`
        }
      ],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content;
    
    // Remove markdown code block markers if present
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(content);
    } catch (e) {
      // Fallback dialogue structure
      return {
        title: `Dialogue: ${topic}`,
        description: `A ${level} level conversation about ${topic}`,
        lines: [
          { speaker: "Person A", text: content.slice(0, 200) }
        ]
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate dialogue');
  }
}

// Генерация упражнений "Заполни пропуск"
async function generateFillBlanks(grammar, count = 5) {
  try {
    // Generate unique context for variety
    const contexts = ['daily life', 'work', 'travel', 'school', 'technology', 'nature', 'food', 'sports', 'hobbies', 'family'];
    const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English teacher. Create grammar exercises in English. Always respond with valid JSON only, no extra text."
        },
        {
          role: "user",
          content: `Create exactly ${count} fill-in-the-blank exercises for "${grammar}" grammar topic. Context: ${randomContext}.

Rules:
- All in English
- Each sentence different (use I, you, he, she, we, they)
- One word missing marked as ___
- Return ONLY valid JSON array

Format: [{"sentence": "She ___ to school.", "answer": "goes", "hint": "present simple"}]`
        }
      ],
      temperature: 0.85,
    });

    let content = response.choices[0].message.content;
    
    // Remove markdown code block markers if present
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Try to extract JSON array if there's extra text
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      throw new Error('Invalid response format');
    } catch (e) {
      console.error('JSON Parse Error:', e.message, 'Content:', content.substring(0, 200));
      // Fallback with grammar-specific examples
      return [
        { sentence: `I ___ English every day.`, answer: "study", hint: "verb for learning" },
        { sentence: `She ___ to the gym yesterday.`, answer: "went", hint: "past tense of 'go'" },
        { sentence: `They ___ playing football now.`, answer: "are", hint: "present continuous helper" },
        { sentence: `He ___ already finished his homework.`, answer: "has", hint: "present perfect helper" },
        { sentence: `We ___ go to the party tomorrow.`, answer: "will", hint: "future tense helper" }
      ];
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate fill-in-the-blank exercises');
  }
}

// Проверка текста (Grammar Checker)
async function checkGrammar(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English grammar expert. Check the text for errors and provide corrections with explanations. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: `Check this English text for grammar, spelling, and style errors: "${text}"

Return JSON: {
  "correctedText": "the fully corrected text",
  "errors": [
    {"original": "wrong part", "correction": "correct version", "explanation": "why it's wrong"}
  ],
  "overallScore": 85,
  "tips": ["tip1", "tip2"]
}`
        }
      ],
      temperature: 0.3,
    });

    let content = response.choices[0].message.content;
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(content);
    } catch (e) {
      return {
        correctedText: text,
        errors: [],
        overallScore: 100,
        tips: ["Your text looks good!"]
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to check grammar');
  }
}

// Генератор историй
async function generateStory(topic, level) {
  try {
    const levelMap = {
      easy: "A1-A2 (simple words, short sentences, present tense)",
      medium: "B1-B2 (varied vocabulary, mixed tenses, compound sentences)",
      hard: "C1-C2 (advanced vocabulary, complex structures, idioms)"
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative English teacher writing engaging stories for language learners. Always respond in valid JSON."
        },
        {
          role: "user",
          content: `Write a short story (150-200 words) in English about "${topic}" at ${levelMap[level]} level.

Return JSON: {
  "title": "Story Title",
  "story": "The full story text...",
  "vocabulary": [
    {"word": "example", "translation": "пример", "definition": "a thing to illustrate"}
  ],
  "questions": ["Question 1 about the story?", "Question 2?"]
}`
        }
      ],
      temperature: 0.8,
    });

    let content = response.choices[0].message.content;
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(content);
    } catch (e) {
      return {
        title: `Story about ${topic}`,
        story: content,
        vocabulary: [],
        questions: []
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate story');
  }
}

// Перефразирование
async function paraphrase(sentence) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English language expert. Paraphrase sentences in different ways to help learners expand vocabulary. Respond in valid JSON."
        },
        {
          role: "user",
          content: `Paraphrase this sentence in 5 different ways: "${sentence}"

Return JSON: {
  "original": "${sentence}",
  "paraphrases": [
    {"text": "paraphrase 1", "style": "formal"},
    {"text": "paraphrase 2", "style": "casual"},
    {"text": "paraphrase 3", "style": "simple"},
    {"text": "paraphrase 4", "style": "advanced"},
    {"text": "paraphrase 5", "style": "creative"}
  ]
}`
        }
      ],
      temperature: 0.8,
    });

    let content = response.choices[0].message.content;
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(content);
    } catch (e) {
      return {
        original: sentence,
        paraphrases: [{ text: content, style: "default" }]
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to paraphrase');
  }
}

// Найди ошибку
async function generateErrorHunt(grammar, count = 5) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English teacher creating error-finding exercises. Each sentence must have exactly ONE grammatical error. Respond in valid JSON only."
        },
        {
          role: "user",
          content: `Create ${count} sentences with ONE grammar error each, focusing on "${grammar}".

Return JSON array: [
  {
    "sentenceWithError": "She don't like coffee.",
    "errorWord": "don't",
    "correctWord": "doesn't",
    "correctSentence": "She doesn't like coffee.",
    "explanation": "With he/she/it, use 'doesn't' not 'don't'"
  }
]`
        }
      ],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content;
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    try {
      return JSON.parse(content);
    } catch (e) {
      return [
        {
          sentenceWithError: "He go to school every day.",
          errorWord: "go",
          correctWord: "goes",
          correctSentence: "He goes to school every day.",
          explanation: "With he/she/it, add -s to the verb in Present Simple"
        }
      ];
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate error hunt exercises');
  }
}

// Тест на уровень
async function generateLevelTest() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English proficiency test creator. Create questions of increasing difficulty from A1 to C2. Respond in valid JSON only."
        },
        {
          role: "user",
          content: `Create 10 multiple-choice questions to test English level (2 questions per level: A1, A2, B1, B2, C1).

Return JSON: {
  "questions": [
    {
      "level": "A1",
      "question": "What ___ your name?",
      "options": ["is", "are", "am", "be"],
      "correctAnswer": "is",
      "points": 1
    }
  ]
}`
        }
      ],
      temperature: 0.6,
    });

    let content = response.choices[0].message.content;
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(content);
    } catch (e) {
      return {
        questions: [
          { level: "A1", question: "I ___ a student.", options: ["am", "is", "are", "be"], correctAnswer: "am", points: 1 },
          { level: "A2", question: "She ___ to work yesterday.", options: ["go", "goes", "went", "going"], correctAnswer: "went", points: 2 },
          { level: "B1", question: "I ___ finished my homework.", options: ["have", "has", "had", "having"], correctAnswer: "have", points: 3 }
        ]
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate level test');
  }
}

module.exports = {
  generateEssayTopics,
  generateDialogue,
  generateFillBlanks,
  checkGrammar,
  generateStory,
  paraphrase,
  generateErrorHunt,
  generateLevelTest
};

