import React, { useState } from 'react';
import axios from 'axios';
import './Generator.css';
import { FaSpinner, FaEdit, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function FillBlankGenerator() {
  const [grammar, setGrammar] = useState('');
  const [exercises, setExercises] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!grammar.trim()) {
      setError('Пожалуйста, введите грамматическую тему');
      return;
    }

    setLoading(true);
    setError('');
    setExercises([]);
    setUserAnswers({});
    setShowResults(false);

    try {
      const response = await axios.post('/api/fill-blank/generate', { grammar, count: 5 });
      setExercises(response.data.exercises);
    } catch (err) {
      setError('Ошибка при генерации упражнений. Проверьте подключение к серверу.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    setUserAnswers({
      ...userAnswers,
      [index]: value
    });
  };

  const handleCheck = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
  };

  // Normalize answer to handle contractions (haven't = have not, etc.)
  const normalizeAnswer = (answer) => {
    const contractions = {
      "haven't": "have not",
      "hasn't": "has not",
      "hadn't": "had not",
      "don't": "do not",
      "doesn't": "does not",
      "didn't": "did not",
      "won't": "will not",
      "wouldn't": "would not",
      "can't": "cannot",
      "couldn't": "could not",
      "shouldn't": "should not",
      "mustn't": "must not",
      "isn't": "is not",
      "aren't": "are not",
      "wasn't": "was not",
      "weren't": "were not",
      "i'm": "i am",
      "you're": "you are",
      "he's": "he is",
      "she's": "she is",
      "it's": "it is",
      "we're": "we are",
      "they're": "they are",
      "i've": "i have",
      "you've": "you have",
      "we've": "we have",
      "they've": "they have",
      "i'll": "i will",
      "you'll": "you will",
      "he'll": "he will",
      "she'll": "she will",
      "it'll": "it will",
      "we'll": "we will",
      "they'll": "they will",
      "i'd": "i would",
      "you'd": "you would",
      "he'd": "he would",
      "she'd": "she would",
      "we'd": "we would",
      "they'd": "they would",
      "let's": "let us",
      "that's": "that is",
      "there's": "there is",
      "here's": "here is",
      "what's": "what is",
      "who's": "who is",
      "where's": "where is",
      "how's": "how is"
    };

    let normalized = answer.trim().toLowerCase();
    
    // Create reverse mapping (full form -> contraction)
    const expandedForms = {};
    for (const [contraction, full] of Object.entries(contractions)) {
      expandedForms[full] = contraction;
    }
    
    // Return both the original normalized and all possible variants
    return {
      original: normalized,
      expanded: contractions[normalized] || normalized,
      contracted: expandedForms[normalized] || normalized
    };
  };

  const isCorrect = (index) => {
    const userAnswer = (userAnswers[index] || '').trim().toLowerCase();
    const correctAnswer = exercises[index].answer.trim().toLowerCase();
    
    // Direct match
    if (userAnswer === correctAnswer) return true;
    
    // Check with normalization (contractions)
    const userNorm = normalizeAnswer(userAnswer);
    const correctNorm = normalizeAnswer(correctAnswer);
    
    // Compare all possible forms
    const userForms = [userNorm.original, userNorm.expanded, userNorm.contracted];
    const correctForms = [correctNorm.original, correctNorm.expanded, correctNorm.contracted];
    
    for (const uf of userForms) {
      for (const cf of correctForms) {
        if (uf === cf) return true;
      }
    }
    
    return false;
  };

  return (
    <div className="generator">
      <div className="generator-header">
        <h2 className="generator-title">
          <FaEdit className="title-icon" />
          Упражнение "Заполни пропуск"
        </h2>
        <p className="generator-subtitle">
          Выберите грамматическую тему и практикуйтесь с упражнениями от ИИ
        </p>
      </div>

      <form onSubmit={handleGenerate} className="generator-form">
        <div className="input-group">
          <input
            type="text"
            value={grammar}
            onChange={(e) => setGrammar(e.target.value)}
            placeholder="Например: Present Perfect, Modal Verbs, Conditionals..."
            className="input-field"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Генерация...
              </>
            ) : (
              'Создать упражнения'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {exercises.length > 0 && (
        <div className="results">
          <h3 className="results-title">Упражнения:</h3>
          <div className="exercises-container">
            {exercises.map((exercise, index) => (
              <div key={index} className="exercise-card">
                <div className="exercise-number">Вопрос {index + 1}</div>
                <p className="exercise-sentence">
                  {exercise.sentence.split('___').map((part, i) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < exercise.sentence.split('___').length - 1 && (
                        <input
                          type="text"
                          className={`blank-input ${
                            showResults 
                              ? isCorrect(index) 
                                ? 'correct' 
                                : 'incorrect'
                              : ''
                          }`}
                          value={userAnswers[index] || ''}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          disabled={showResults}
                          placeholder="___"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </p>
                
                {exercise.hint && (
                  <p className="exercise-hint">💡 Подсказка: {exercise.hint}</p>
                )}

                {showResults && (
                  <div className={`result-feedback ${isCorrect(index) ? 'correct' : 'incorrect'}`}>
                    {isCorrect(index) ? (
                      <>
                        <FaCheckCircle /> Правильно!
                      </>
                    ) : (
                      <>
                        <FaTimesCircle /> Правильный ответ: <strong>{exercise.answer}</strong>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="exercise-actions">
            {!showResults ? (
              <button 
                className="check-button"
                onClick={handleCheck}
                disabled={Object.keys(userAnswers).length === 0}
              >
                Проверить ответы
              </button>
            ) : (
              <button 
                className="reset-button"
                onClick={handleReset}
              >
                Попробовать снова
              </button>
            )}
          </div>

          {showResults && (
            <div className="score-summary">
              Результат: {exercises.filter((_, i) => isCorrect(i)).length} из {exercises.length} правильных
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FillBlankGenerator;

