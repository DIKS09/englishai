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
          content: "You are an English teacher helping students practice essay writing. Generate creative and educational essay topics."
        },
        {
          role: "user",
          content: `Generate 5 interesting essay topics related to the keyword "${keyword}". Each topic should be thought-provoking and suitable for English learners. Format: Return a JSON array of objects with 'title' and 'description' fields.`
        }
      ],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    
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
          content: "You are an English teacher creating dialogue exercises for students."
        },
        {
          role: "user",
          content: `Create a dialogue between 2 people about "${topic}" at ${levelDescriptions[level]}. The dialogue should have 8-10 exchanges (4-5 per person). Format: Return a JSON object with 'title', 'description', and 'lines' array. Each line should have 'speaker' and 'text' fields.`
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English teacher creating grammar exercises."
        },
        {
          role: "user",
          content: `Create ${count} fill-in-the-blank exercises focusing on "${grammar}". Each sentence should have ONE word missing (marked with ___). Format: Return a JSON array of objects with 'sentence' (with ___), 'answer' (the missing word), and 'hint' fields.`
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (e) {
      // Fallback
      return [
        {
          sentence: `This is a sample sentence with a ___ word.`,
          answer: "missing",
          hint: `A word that means 'not present'`
        }
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

