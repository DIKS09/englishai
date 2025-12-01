import React, { useState } from 'react';
import axios from 'axios';
import './Generator.css';
import { FaSpinner, FaLightbulb } from 'react-icons/fa';

function EssayGenerator() {
  const [keyword, setKeyword] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      setError('Пожалуйста, введите ключевое слово');
      return;
    }

    setLoading(true);
    setError('');
    setTopics([]);

    try {
      const response = await axios.post('/api/essay/generate', { keyword });
      setTopics(response.data.topics);
    } catch (err) {
      setError('Ошибка при генерации тем. Проверьте подключение к серверу.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator">
      <div className="generator-header">
        <h2 className="generator-title">
          <FaLightbulb className="title-icon" />
          Генератор тем для эссе
        </h2>
        <p className="generator-subtitle">
          Введите ключевое слово, и ИИ предложит вам интересные темы для написания эссе
        </p>
      </div>

      <form onSubmit={handleGenerate} className="generator-form">
        <div className="input-group">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Например: technology, nature, education..."
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
              'Сгенерировать темы'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {topics.length > 0 && (
        <div className="results">
          <h3 className="results-title">Предложенные темы:</h3>
          <div className="topics-grid">
            {topics.map((topic, index) => (
              <div key={index} className="topic-card">
                <div className="topic-number">{index + 1}</div>
                <h4 className="topic-title">{topic.title}</h4>
                {topic.description && (
                  <p className="topic-description">{topic.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EssayGenerator;

