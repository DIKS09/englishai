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

module.exports = {
  generateEssayTopics,
  generateDialogue,
  generateFillBlanks
};

