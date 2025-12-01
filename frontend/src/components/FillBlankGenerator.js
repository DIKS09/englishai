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

  const isCorrect = (index) => {
    const userAnswer = (userAnswers[index] || '').trim().toLowerCase();
    const correctAnswer = exercises[index].answer.trim().toLowerCase();
    return userAnswer === correctAnswer;
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

