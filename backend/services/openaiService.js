const OpenAI = require('openai');

// =====================================================
// 🎯 DEMO MODE - Работает без API ключа!
// =====================================================
const DEMO_MODE = !process.env.OPENAI_API_KEY || process.env.DEMO_MODE === 'true';

// Создаём OpenAI клиент только если есть ключ
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI API configured');
} else {
  console.log('⚠️ No OPENAI_API_KEY - running in DEMO MODE with sample data');
}

// Генерация тем для эссе
async function generateEssayTopics(keyword) {
  if (DEMO_MODE) {
    // Фиксированные данные для исследования
    const demoTopics = {
      'technology': [
        { title: "The Impact of Artificial Intelligence on Employment", description: "Explore how AI is transforming job markets and what skills will be essential in the future workforce." },
        { title: "Digital Privacy in the Age of Smart Devices", description: "Discuss the trade-offs between convenience and privacy when using connected devices in our daily lives." },
        { title: "Social Media's Influence on Mental Health", description: "Analyze the psychological effects of social media usage on different age groups and propose solutions." },
        { title: "The Future of Education: Virtual Reality Classrooms", description: "Examine how VR technology could revolutionize learning experiences and make education more accessible." },
        { title: "Ethical Considerations in Genetic Engineering", description: "Discuss the moral implications of gene editing technologies like CRISPR and their potential applications." }
      ],
      'environment': [
        { title: "Microplastics: The Invisible Threat to Our Oceans", description: "Investigate the sources of microplastic pollution and its effects on marine ecosystems." },
        { title: "Urban Green Spaces and Quality of Life", description: "Analyze the importance of parks and gardens in modern cities for physical and mental well-being." },
        { title: "Fast Fashion's Environmental Footprint", description: "Examine the environmental cost of cheap clothing and explore sustainable alternatives." },
        { title: "Carbon Offsetting: Solution or Greenwashing?", description: "Critically evaluate whether carbon offset programs are effective in combating climate change." },
        { title: "The Role of Individual Actions in Climate Change", description: "Debate whether personal lifestyle changes can make a significant impact on global environmental issues." }
      ]
    };
    
    // Возвращаем данные по ключевому слову или дефолтные
    const lowerKeyword = keyword.toLowerCase();
    if (demoTopics[lowerKeyword]) {
      return demoTopics[lowerKeyword];
    }
    
    // Дефолтные темы для любого ключевого слова
    return [
      { title: `The Evolution of ${keyword} in Modern Society`, description: `Explore how ${keyword} has shaped our daily lives and its potential future developments.` },
      { title: `${keyword} and Its Impact on Youth`, description: `Analyze how younger generations are influenced by and interact with ${keyword}.` },
      { title: `The Economic Implications of ${keyword}`, description: `Discuss the financial aspects and market trends related to ${keyword}.` },
      { title: `${keyword}: Challenges and Opportunities`, description: `Examine both the obstacles and possibilities that ${keyword} presents to society.` },
      { title: `The Future of ${keyword}: Predictions and Possibilities`, description: `Consider what developments we might see in ${keyword} over the next decade.` }
    ];
  }

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
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(content);
    } catch (e) {
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
  if (DEMO_MODE) {
    const demoDialogues = {
      'easy': {
        title: "At the Cafe",
        description: "A simple conversation between a waiter and a customer ordering coffee.",
        lines: [
          { speaker: "Waiter", text: "Hello! Welcome to our cafe." },
          { speaker: "Customer", text: "Hello! Can I see the menu, please?" },
          { speaker: "Waiter", text: "Of course. Here you are." },
          { speaker: "Customer", text: "Thank you. I want a coffee, please." },
          { speaker: "Waiter", text: "Sure. Big or small?" },
          { speaker: "Customer", text: "Small, please. How much is it?" },
          { speaker: "Waiter", text: "It's two dollars." },
          { speaker: "Customer", text: "Here you are. Thank you!" },
          { speaker: "Waiter", text: "Thank you! Have a nice day!" },
          { speaker: "Customer", text: "You too! Goodbye!" }
        ]
      },
      'medium': {
        title: "Job Interview",
        description: "A professional conversation between an interviewer and a job candidate.",
        lines: [
          { speaker: "Interviewer", text: "Good morning. Please, have a seat. Tell me about yourself." },
          { speaker: "Candidate", text: "Good morning. I'm a software developer with five years of experience in web development." },
          { speaker: "Interviewer", text: "What attracted you to this position?" },
          { speaker: "Candidate", text: "I've been following your company's innovative projects, and I believe my skills would be a great match." },
          { speaker: "Interviewer", text: "Can you describe a challenging project you've worked on?" },
          { speaker: "Candidate", text: "I led a team that developed a real-time analytics platform, which required solving complex scalability issues." },
          { speaker: "Interviewer", text: "Impressive. What are your salary expectations?" },
          { speaker: "Candidate", text: "Based on my experience and the market rate, I'm looking for something in the range of $80,000 to $90,000." },
          { speaker: "Interviewer", text: "That's within our budget. When could you start?" },
          { speaker: "Candidate", text: "I could start in two weeks after giving notice at my current position." }
        ]
      },
      'hard': {
        title: "Business Negotiation",
        description: "An advanced discussion between two executives about partnership terms.",
        lines: [
          { speaker: "Executive A", text: "Given the current market volatility, we need to reassess our strategic partnership terms." },
          { speaker: "Executive B", text: "I appreciate your candor. What specific aspects would you like to renegotiate?" },
          { speaker: "Executive A", text: "The exclusivity clause seems overly restrictive considering our expansion into emerging markets." },
          { speaker: "Executive B", text: "That's a fair point. However, we'd need some form of compensation for loosening those terms." },
          { speaker: "Executive A", text: "We're prepared to offer an increased revenue share of 2.5% in lieu of territorial exclusivity." },
          { speaker: "Executive B", text: "That's an interesting proposition. Let me consult with our stakeholders before making any commitments." },
          { speaker: "Executive A", text: "Of course. We're also open to discussing performance-based incentives." },
          { speaker: "Executive B", text: "That could work. Perhaps we could tie the revenue share to quarterly targets?" },
          { speaker: "Executive A", text: "Precisely what I had in mind. Shall we draft a preliminary framework?" },
          { speaker: "Executive B", text: "Let's proceed. I'll have my legal team prepare the documentation." }
        ]
      }
    };
    
    return demoDialogues[level] || demoDialogues['medium'];
  }

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
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(content);
    } catch (e) {
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
  if (DEMO_MODE) {
    const demoExercises = {
      'present perfect': [
        { sentence: "I have already ___ my homework.", answer: "finished", hint: "finish" },
        { sentence: "She has ___ to Paris twice.", answer: "been", hint: "be" },
        { sentence: "They have never ___ sushi before.", answer: "tried", hint: "try" },
        { sentence: "He has ___ English for five years.", answer: "studied", hint: "study" },
        { sentence: "We have just ___ the movie.", answer: "watched", hint: "watch" }
      ],
      'past simple': [
        { sentence: "She ___ to the gym yesterday.", answer: "went", hint: "go" },
        { sentence: "He ___ a letter last week.", answer: "wrote", hint: "write" },
        { sentence: "We ___ a great movie last night.", answer: "watched", hint: "watch" },
        { sentence: "They ___ home at 6 PM.", answer: "arrived", hint: "arrive" },
        { sentence: "I ___ my keys this morning.", answer: "lost", hint: "lose" }
      ],
      'modal verbs': [
        { sentence: "You ___ see a doctor. You look sick.", answer: "should", hint: "should" },
        { sentence: "She ___ speak three languages fluently.", answer: "can", hint: "can" },
        { sentence: "They ___ leave early tomorrow.", answer: "must", hint: "must" },
        { sentence: "I ___ help you if you want.", answer: "could", hint: "could" },
        { sentence: "We ___ go to the party tomorrow.", answer: "will", hint: "will" }
      ],
      'present simple': [
        { sentence: "She ___ to work every day.", answer: "goes", hint: "go" },
        { sentence: "He ___ coffee in the morning.", answer: "drinks", hint: "drink" },
        { sentence: "They ___ English at school.", answer: "study", hint: "study" },
        { sentence: "The sun ___ in the east.", answer: "rises", hint: "rise" },
        { sentence: "My mother ___ delicious food.", answer: "cooks", hint: "cook" }
      ]
    };
    
    const lowerGrammar = grammar.toLowerCase();
    for (const key in demoExercises) {
      if (lowerGrammar.includes(key) || key.includes(lowerGrammar)) {
        return demoExercises[key];
      }
    }
    
    // Дефолтные упражнения
    return [
      { sentence: "She ___ to work every day.", answer: "goes", hint: "go" },
      { sentence: "I have already ___ my homework.", answer: "finished", hint: "finish" },
      { sentence: "They ___ watching TV when I arrived.", answer: "were", hint: "be" },
      { sentence: "He ___ a letter yesterday.", answer: "wrote", hint: "write" },
      { sentence: "She has ___ to Paris twice.", answer: "been", hint: "be" }
    ];
  }

  try {
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
      throw new Error('Invalid response format');
    } catch (e) {
      console.error('JSON Parse Error:', e.message, 'Content:', content.substring(0, 200));
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
  if (DEMO_MODE) {
    // Анализируем текст и возвращаем фиксированный результат
    const hasErrors = text.toLowerCase().includes('i goes') || 
                      text.toLowerCase().includes('she go ') ||
                      text.toLowerCase().includes('they was') ||
                      text.toLowerCase().includes('he don\'t');
    
    if (hasErrors) {
      return {
        correctedText: text.replace(/i goes/gi, 'I go')
                          .replace(/she go /gi, 'she goes ')
                          .replace(/they was/gi, 'they were')
                          .replace(/he don't/gi, "he doesn't"),
        errors: [
          { original: "Common grammar mistake", correction: "Corrected form", explanation: "Subject-verb agreement is important in English." }
        ],
        overallScore: 65,
        tips: [
          "Remember: I/you/we/they + base verb, he/she/it + verb+s",
          "Practice subject-verb agreement exercises",
          "Read more English texts to improve naturally"
        ]
      };
    }
    
    return {
      correctedText: text,
      errors: [],
      overallScore: 95,
      tips: [
        "Excellent grammar! Keep up the good work!",
        "Try using more complex sentence structures",
        "Consider adding transitional phrases for better flow"
      ]
    };
  }

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
    
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    try {
      const parsed = JSON.parse(content);
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
  if (DEMO_MODE) {
    const demoStories = {
      'easy': {
        title: "The Lost Puppy",
        story: "One sunny morning, a little girl named Emma found a small puppy in the park. The puppy was brown and white. It looked sad and hungry. Emma gave the puppy some water and a piece of her sandwich. The puppy was very happy! Emma put a sign on a tree: \"Found: small puppy.\" The next day, a boy came to the park. \"That's my puppy Max!\" he said. Emma was sad to say goodbye, but she was happy that Max found his home. The boy thanked Emma and gave her a big smile. \"You can visit Max anytime,\" he said. Emma smiled back. She made a new friend that day.",
        vocabulary: [
          { word: "puppy", translation: "щенок", definition: "a young dog" },
          { word: "sunny", translation: "солнечный", definition: "with a lot of light from the sun" },
          { word: "hungry", translation: "голодный", definition: "wanting to eat food" },
          { word: "sign", translation: "табличка", definition: "a notice giving information" },
          { word: "smile", translation: "улыбка", definition: "an expression with the corners of the mouth turned up" }
        ],
        questions: [
          "Where did Emma find the puppy?",
          "What did Emma give to the puppy?",
          "Who was the owner of the puppy?"
        ]
      },
      'medium': {
        title: "The Mysterious Letter",
        story: "Sarah had always been curious about the old house at the end of her street. One autumn afternoon, while walking home from school, she noticed an envelope sticking out of the rusty mailbox. Unable to resist, she carefully pulled it out. The letter was addressed to \"The Brave One\" with no return address. Inside, she found a hand-drawn map leading to the town library. Following the map, Sarah discovered a hidden room behind the history section. There, she found a collection of journals written by previous explorers of the town's secrets. Each journal contained clues about local mysteries waiting to be solved. Sarah realized she had just joined a secret society of curious minds, and her adventures were only beginning.",
        vocabulary: [
          { word: "curious", translation: "любопытный", definition: "eager to know or learn something" },
          { word: "mysterious", translation: "загадочный", definition: "difficult to understand or explain" },
          { word: "envelope", translation: "конверт", definition: "a paper container for a letter" },
          { word: "discover", translation: "обнаружить", definition: "to find something for the first time" },
          { word: "adventure", translation: "приключение", definition: "an exciting experience" }
        ],
        questions: [
          "What caught Sarah's attention at the old house?",
          "Where did the map lead Sarah?",
          "What did Sarah find in the hidden room?"
        ]
      },
      'hard': {
        title: "The Quantum Paradox",
        story: "Dr. Elena Voss stood before the quantum processor, her life's work humming with unprecedented energy. The machine had achieved what theoretical physicists had deemed impossible: stable quantum entanglement across temporal dimensions. As she initiated the first controlled observation, reality itself seemed to shudder. The implications were staggering—not merely the ability to observe the past, but potentially to influence causality chains that had long since crystallized into historical fact. Yet Elena hesitated. Her mentor's warnings echoed in her mind: \"To observe is to participate; to participate is to become responsible.\" The ethical ramifications of temporal observation demanded a framework that humanity had yet to develop. With trembling hands, she documented her findings and sealed the laboratory, understanding that some discoveries must await the wisdom to wield them responsibly.",
        vocabulary: [
          { word: "unprecedented", translation: "беспрецедентный", definition: "never done or known before" },
          { word: "entanglement", translation: "запутанность", definition: "a quantum phenomenon where particles become interconnected" },
          { word: "implications", translation: "последствия", definition: "possible effects or results" },
          { word: "causality", translation: "причинность", definition: "the relationship between cause and effect" },
          { word: "ramifications", translation: "разветвления", definition: "complex consequences of an action" }
        ],
        questions: [
          "What breakthrough did Dr. Voss's machine achieve?",
          "Why did Elena hesitate to proceed with her experiment?",
          "What decision did Elena make at the end?"
        ]
      }
    };
    
    return demoStories[level] || demoStories['medium'];
  }

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
    
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
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
  if (DEMO_MODE) {
    return {
      original: sentence,
      paraphrases: [
        { text: `${sentence.charAt(0).toUpperCase() + sentence.slice(1).replace(/[.!?]$/, '')} in a professional manner.`, style: "formal" },
        { text: `So basically, ${sentence.toLowerCase().replace(/[.!?]$/, '')}, you know?`, style: "casual" },
        { text: `${sentence.split(' ').slice(0, -2).join(' ')} simply.`, style: "simple" },
        { text: `One might articulate that ${sentence.toLowerCase()}`, style: "advanced" },
        { text: `Picture this: ${sentence.toLowerCase()}`, style: "creative" }
      ]
    };
  }

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
    
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
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
  if (DEMO_MODE) {
    const demoErrors = {
      'verb tenses': [
        { sentenceWithError: "He go to school every day.", errorWord: "go", correctWord: "goes", correctSentence: "He goes to school every day.", explanation: "With he/she/it, add -s to the verb in Present Simple" },
        { sentenceWithError: "She don't like coffee.", errorWord: "don't", correctWord: "doesn't", correctSentence: "She doesn't like coffee.", explanation: "With he/she/it, use 'doesn't' not 'don't'" },
        { sentenceWithError: "They was playing football yesterday.", errorWord: "was", correctWord: "were", correctSentence: "They were playing football yesterday.", explanation: "Use 'were' with plural subjects (they, we, you)" },
        { sentenceWithError: "I have went to Paris last year.", errorWord: "went", correctWord: "been", correctSentence: "I have been to Paris.", explanation: "Use past participle 'been' with have/has, not past simple" },
        { sentenceWithError: "She can to swim very well.", errorWord: "to", correctWord: "", correctSentence: "She can swim very well.", explanation: "Don't use 'to' after modal verbs (can, could, must, etc.)" }
      ],
      'articles': [
        { sentenceWithError: "I saw a elephant at the zoo.", errorWord: "a", correctWord: "an", correctSentence: "I saw an elephant at the zoo.", explanation: "Use 'an' before words starting with vowel sounds (a, e, i, o, u)" },
        { sentenceWithError: "She is best student in the class.", errorWord: "best", correctWord: "the best", correctSentence: "She is the best student in the class.", explanation: "Superlative adjectives require 'the' before them" },
        { sentenceWithError: "He plays a piano very well.", errorWord: "a", correctWord: "the", correctSentence: "He plays the piano very well.", explanation: "Use 'the' with musical instruments" },
        { sentenceWithError: "Sun rises in the east.", errorWord: "Sun", correctWord: "The sun", correctSentence: "The sun rises in the east.", explanation: "Use 'the' with unique objects (sun, moon, earth)" },
        { sentenceWithError: "I need an advice about my career.", errorWord: "an", correctWord: "", correctSentence: "I need advice about my career.", explanation: "'Advice' is uncountable - don't use a/an with it" }
      ],
      'prepositions': [
        { sentenceWithError: "I arrived to the airport on time.", errorWord: "to", correctWord: "at", correctSentence: "I arrived at the airport on time.", explanation: "Use 'arrive at' for specific places, 'arrive in' for cities/countries" },
        { sentenceWithError: "She is very good in mathematics.", errorWord: "in", correctWord: "at", correctSentence: "She is very good at mathematics.", explanation: "Use 'good at' for skills and subjects" },
        { sentenceWithError: "I'm interested for modern art.", errorWord: "for", correctWord: "in", correctSentence: "I'm interested in modern art.", explanation: "The correct phrase is 'interested in'" },
        { sentenceWithError: "He depends of his parents financially.", errorWord: "of", correctWord: "on", correctSentence: "He depends on his parents financially.", explanation: "The correct phrase is 'depend on'" },
        { sentenceWithError: "We discussed about the new plan.", errorWord: "about", correctWord: "", correctSentence: "We discussed the new plan.", explanation: "'Discuss' is a transitive verb - no preposition needed" }
      ]
    };
    
    const lowerGrammar = grammar.toLowerCase();
    for (const key in demoErrors) {
      if (lowerGrammar.includes(key) || key.includes(lowerGrammar)) {
        return demoErrors[key];
      }
    }
    
    // Дефолтные ошибки
    return demoErrors['verb tenses'];
  }

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
  if (DEMO_MODE) {
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
