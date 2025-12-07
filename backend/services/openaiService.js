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
          content: "You are a professional English teacher creating grammar exercises. You MUST create grammatically PERFECT sentences. Double-check every sentence for correctness before including it. All sentences must be natural, commonly used English phrases."
        },
        {
          role: "user",
          content: `Create exactly ${count} GRAMMATICALLY PERFECT fill-in-the-blank exercises for "${grammar}". Context: ${randomContext}.

CRITICAL REQUIREMENTS:
1. Every sentence MUST be 100% grammatically correct when the blank is filled
2. Use natural, everyday English expressions
3. The missing word should clearly demonstrate the grammar rule
4. Vary subjects: I, you, he, she, it, we, they
5. Each sentence must be unique and different
6. Mark missing word with ___
7. HINT must be the BASE FORM of the word that needs to be changed (infinitive for verbs)

Examples of CORRECT exercises:
- {"sentence": "She ___ to work every day.", "answer": "goes", "hint": "go"}
- {"sentence": "I have already ___ my homework.", "answer": "finished", "hint": "finish"}
- {"sentence": "They ___ watching TV when I arrived.", "answer": "were", "hint": "be"}
- {"sentence": "He ___ a letter yesterday.", "answer": "wrote", "hint": "write"}
- {"sentence": "She has ___ to Paris twice.", "answer": "been", "hint": "be"}

The hint is the dictionary/base form of the word. User must change it to fit the sentence.

Return ONLY a valid JSON array. No explanations.`
        }
      ],
      temperature: 0.5,
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
        { sentence: `I ___ English every day.`, answer: "study", hint: "study" },
        { sentence: `She ___ to the gym yesterday.`, answer: "went", hint: "go" },
        { sentence: `They ___ playing football now.`, answer: "are", hint: "be" },
        { sentence: `He has already ___ his homework.`, answer: "finished", hint: "finish" },
        { sentence: `We ___ go to the party tomorrow.`, answer: "will", hint: "will" }
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
    console.log('Checking grammar for text:', text.substring(0, 50) + '...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English grammar expert. Analyze text and return ONLY valid JSON. No extra text or explanations outside JSON."
        },
        {
          role: "user",
          content: `Analyze this English text for grammar, spelling, and style errors: "${text}"

Return this EXACT JSON structure:
{"correctedText": "corrected version of the text", "errors": [{"original": "error", "correction": "fix", "explanation": "why"}], "overallScore": 75, "tips": ["tip 1", "tip 2"]}

Rules:
- overallScore is 0-100 (100 = perfect)
- If no errors found, return empty errors array and score 100
- Return ONLY the JSON, nothing else`
        }
      ],
      temperature: 0.2,
    });

    let content = response.choices[0].message.content;
    console.log('OpenAI response for grammar:', content.substring(0, 100) + '...');
    
    // Clean response
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Try to extract JSON if wrapped in text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    try {
      const parsed = JSON.parse(content);
      // Validate required fields
      return {
        correctedText: parsed.correctedText || text,
        errors: Array.isArray(parsed.errors) ? parsed.errors : [],
        overallScore: typeof parsed.overallScore === 'number' ? parsed.overallScore : 80,
        tips: Array.isArray(parsed.tips) ? parsed.tips : ["Keep practicing!"]
      };
    } catch (e) {
      console.error('JSON parse error in checkGrammar:', e.message);
      return {
        correctedText: text,
        errors: [],
        overallScore: 85,
        tips: ["Text analyzed. Keep practicing your English!"]
      };
    }
  } catch (error) {
    console.error('OpenAI API Error in checkGrammar:', error.message);
    // Return fallback instead of throwing
    return {
      correctedText: text,
      errors: [],
      overallScore: 0,
      tips: ["Sorry, analysis failed. Please try again."]
    };
  }
}

// Генератор историй
async function generateStory(topic, level) {
  try {
    console.log('Generating story:', topic, level);
    
    const levelMap = {
      easy: "A1-A2 (simple words, short sentences, present tense)",
      medium: "B1-B2 (varied vocabulary, mixed tenses, compound sentences)",
      hard: "C1-C2 (advanced vocabulary, complex structures, idioms)"
    };

    const levelDesc = levelMap[level] || levelMap.medium;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a creative English teacher. Write engaging stories and return ONLY valid JSON. No extra text."
        },
        {
          role: "user",
          content: `Write a short story (150-200 words) in English about "${topic}" at ${levelDesc} level.

Return this EXACT JSON structure:
{"title": "Story Title", "story": "Full story text here...", "vocabulary": [{"word": "word1", "translation": "перевод", "definition": "meaning"}], "questions": ["Question 1?", "Question 2?"]}

Requirements:
- Story must be interesting and engaging
- Include 3-5 vocabulary words
- Include 2-3 comprehension questions
- Return ONLY JSON, nothing else`
        }
      ],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content;
    console.log('Story response:', content.substring(0, 100) + '...');
    
    // Clean response
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Try to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    try {
      const parsed = JSON.parse(content);
      return {
        title: parsed.title || `Story about ${topic}`,
        story: parsed.story || content,
        vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
        questions: Array.isArray(parsed.questions) ? parsed.questions : []
      };
    } catch (e) {
      console.error('JSON parse error in generateStory:', e.message);
      return {
        title: `Story about ${topic}`,
        story: content,
        vocabulary: [],
        questions: ["What did you learn from this story?"]
      };
    }
  } catch (error) {
    console.error('OpenAI API Error in generateStory:', error.message);
    // Return fallback instead of throwing
    return {
      title: `A ${topic} Adventure`,
      story: `Once upon a time, there was a wonderful adventure about ${topic}. The story was full of excitement and learning. Unfortunately, we couldn't generate the full story right now. Please try again!`,
      vocabulary: [
        { word: "adventure", translation: "приключение", definition: "an exciting experience" },
        { word: "wonderful", translation: "замечательный", definition: "extremely good" }
      ],
      questions: ["What would you like to read about?", "Try generating another story!"]
    };
  }
}

// Перефразирование
async function paraphrase(sentence) {
  try {
    console.log('Paraphrasing:', sentence.substring(0, 50) + '...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English language expert. Paraphrase sentences in different styles. Return ONLY valid JSON, no extra text."
        },
        {
          role: "user",
          content: `Paraphrase this sentence in 5 different ways: "${sentence}"

Return this EXACT JSON structure:
{"original": "${sentence}", "paraphrases": [{"text": "version 1", "style": "formal"}, {"text": "version 2", "style": "casual"}, {"text": "version 3", "style": "simple"}, {"text": "version 4", "style": "advanced"}, {"text": "version 5", "style": "creative"}]}

Rules:
- formal = professional/business language
- casual = everyday friendly language
- simple = easy words for beginners
- advanced = sophisticated vocabulary
- creative = unique/unusual phrasing
- Return ONLY JSON`
        }
      ],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content;
    console.log('Paraphrase response:', content.substring(0, 100) + '...');
    
    // Clean response
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Try to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    try {
      const parsed = JSON.parse(content);
      return {
        original: parsed.original || sentence,
        paraphrases: Array.isArray(parsed.paraphrases) ? parsed.paraphrases : []
      };
    } catch (e) {
      console.error('JSON parse error in paraphrase:', e.message);
      return {
        original: sentence,
        paraphrases: [
          { text: content || "Alternative version of the sentence", style: "default" }
        ]
      };
    }
  } catch (error) {
    console.error('OpenAI API Error in paraphrase:', error.message);
    // Return fallback instead of throwing
    return {
      original: sentence,
      paraphrases: [
        { text: "This sentence can be said differently.", style: "formal" },
        { text: "You could say this another way!", style: "casual" },
        { text: "Same meaning, different words.", style: "simple" },
        { text: "An alternative formulation exists.", style: "advanced" },
        { text: "Try rephrasing it yourself!", style: "creative" }
      ]
    };
  }
}

// Найди ошибку
async function generateErrorHunt(grammar, count = 5) {
  try {
    console.log('Generating Error Hunt:', grammar, count);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English teacher creating error-finding exercises. Each sentence has exactly ONE grammatical error. Return ONLY valid JSON array."
        },
        {
          role: "user",
          content: `Create ${count} sentences with ONE grammar error each, focusing on "${grammar}".

Return this EXACT JSON array format:
[{"sentenceWithError": "She don't like coffee.", "errorWord": "don't", "correctWord": "doesn't", "correctSentence": "She doesn't like coffee.", "explanation": "With he/she/it use doesn't"}]

Rules:
- Each sentence has exactly ONE error
- Vary the subjects (I, you, he, she, we, they)
- Make clear, common errors for learners to find
- Return ONLY JSON array`
        }
      ],
      temperature: 0.6,
    });

    let content = response.choices[0].message.content;
    console.log('Error Hunt response:', content.substring(0, 100) + '...');
    
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      throw new Error('Invalid array');
    } catch (e) {
      console.error('JSON parse error in generateErrorHunt:', e.message);
      return [
        { sentenceWithError: "He go to school every day.", errorWord: "go", correctWord: "goes", correctSentence: "He goes to school every day.", explanation: "With he/she/it, add -s to the verb in Present Simple" },
        { sentenceWithError: "She don't like coffee.", errorWord: "don't", correctWord: "doesn't", correctSentence: "She doesn't like coffee.", explanation: "With he/she/it, use 'doesn't' not 'don't'" },
        { sentenceWithError: "They was playing football.", errorWord: "was", correctWord: "were", correctSentence: "They were playing football.", explanation: "Use 'were' with plural subjects" },
        { sentenceWithError: "I have went to Paris.", errorWord: "went", correctWord: "been", correctSentence: "I have been to Paris.", explanation: "Use past participle 'been' with have/has" },
        { sentenceWithError: "She can to swim.", errorWord: "to", correctWord: "", correctSentence: "She can swim.", explanation: "Don't use 'to' after modal verbs" }
      ];
    }
  } catch (error) {
    console.error('OpenAI API Error in generateErrorHunt:', error.message);
    // Return fallback
    return [
      { sentenceWithError: "He go to school every day.", errorWord: "go", correctWord: "goes", correctSentence: "He goes to school every day.", explanation: "With he/she/it, add -s to the verb in Present Simple" },
      { sentenceWithError: "She don't like coffee.", errorWord: "don't", correctWord: "doesn't", correctSentence: "She doesn't like coffee.", explanation: "With he/she/it, use 'doesn't' not 'don't'" },
      { sentenceWithError: "They was playing football.", errorWord: "was", correctWord: "were", correctSentence: "They were playing football.", explanation: "Use 'were' with plural subjects" },
      { sentenceWithError: "I have went to Paris.", errorWord: "went", correctWord: "been", correctSentence: "I have been to Paris.", explanation: "Use past participle 'been' with have/has" },
      { sentenceWithError: "She can to swim.", errorWord: "to", correctWord: "", correctSentence: "She can swim.", explanation: "Don't use 'to' after modal verbs" }
    ];
  }
}

// Тест на уровень
async function generateLevelTest() {
  try {
    console.log('Generating Level Test...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an English proficiency test creator. Create questions of increasing difficulty. Return ONLY valid JSON."
        },
        {
          role: "user",
          content: `Create 10 multiple-choice questions to test English level (2 per level: A1, A2, B1, B2, C1).

Return this EXACT JSON structure:
{"questions": [{"level": "A1", "question": "What ___ your name?", "options": ["is", "are", "am", "be"], "correctAnswer": "is", "points": 1}]}

Rules:
- 2 questions for A1 (points: 1), A2 (points: 2), B1 (points: 3), B2 (points: 4), C1 (points: 5)
- Each question has exactly 4 options
- Questions test grammar, vocabulary, or comprehension
- Return ONLY JSON`
        }
      ],
      temperature: 0.5,
    });

    let content = response.choices[0].message.content;
    console.log('Level Test response:', content.substring(0, 100) + '...');
    
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    // Try to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    try {
      const parsed = JSON.parse(content);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed;
      }
      throw new Error('Invalid format');
    } catch (e) {
      console.error('JSON parse error in generateLevelTest:', e.message);
      return {
        questions: [
          { level: "A1", question: "I ___ a student.", options: ["am", "is", "are", "be"], correctAnswer: "am", points: 1 },
          { level: "A1", question: "___ is your name?", options: ["What", "Where", "Who", "How"], correctAnswer: "What", points: 1 },
          { level: "A2", question: "She ___ to work yesterday.", options: ["go", "goes", "went", "going"], correctAnswer: "went", points: 2 },
          { level: "A2", question: "There ___ many people at the party.", options: ["was", "were", "is", "be"], correctAnswer: "were", points: 2 },
          { level: "B1", question: "I ___ never been to Japan.", options: ["have", "has", "had", "am"], correctAnswer: "have", points: 3 },
          { level: "B1", question: "If I ___ rich, I would travel the world.", options: ["am", "was", "were", "be"], correctAnswer: "were", points: 3 },
          { level: "B2", question: "She suggested ___ to the cinema.", options: ["to go", "going", "go", "went"], correctAnswer: "going", points: 4 },
          { level: "B2", question: "The book ___ by millions of people.", options: ["has read", "has been read", "have been read", "is reading"], correctAnswer: "has been read", points: 4 },
          { level: "C1", question: "Had I known, I ___ you.", options: ["would help", "would have helped", "will help", "helped"], correctAnswer: "would have helped", points: 5 },
          { level: "C1", question: "The matter is too complex to be ___ lightly.", options: ["taken", "took", "taking", "take"], correctAnswer: "taken", points: 5 }
        ]
      };
    }
  } catch (error) {
    console.error('OpenAI API Error in generateLevelTest:', error.message);
    // Return fallback
    return {
      questions: [
        { level: "A1", question: "I ___ a student.", options: ["am", "is", "are", "be"], correctAnswer: "am", points: 1 },
        { level: "A1", question: "___ is your name?", options: ["What", "Where", "Who", "How"], correctAnswer: "What", points: 1 },
        { level: "A2", question: "She ___ to work yesterday.", options: ["go", "goes", "went", "going"], correctAnswer: "went", points: 2 },
        { level: "A2", question: "There ___ many people at the party.", options: ["was", "were", "is", "be"], correctAnswer: "were", points: 2 },
        { level: "B1", question: "I ___ never been to Japan.", options: ["have", "has", "had", "am"], correctAnswer: "have", points: 3 },
        { level: "B1", question: "If I ___ rich, I would travel the world.", options: ["am", "was", "were", "be"], correctAnswer: "were", points: 3 },
        { level: "B2", question: "She suggested ___ to the cinema.", options: ["to go", "going", "go", "went"], correctAnswer: "going", points: 4 },
        { level: "B2", question: "The book ___ by millions of people.", options: ["has read", "has been read", "have been read", "is reading"], correctAnswer: "has been read", points: 4 },
        { level: "C1", question: "Had I known, I ___ you.", options: ["would help", "would have helped", "will help", "helped"], correctAnswer: "would have helped", points: 5 },
        { level: "C1", question: "The matter is too complex to be ___ lightly.", options: ["taken", "took", "taking", "take"], correctAnswer: "taken", points: 5 }
      ]
    };
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

