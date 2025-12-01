import React, { useState } from 'react';
import axios from 'axios';
import './Generator.css';
import { FaSpinner, FaComments } from 'react-icons/fa';

function DialogueGenerator() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('medium');
  const [dialogue, setDialogue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Пожалуйста, введите тему диалога');
      return;
    }

    setLoading(true);
    setError('');
    setDialogue(null);

    try {
      const response = await axios.post('/api/dialogue/generate', { topic, level });
      setDialogue(response.data.dialogue);
    } catch (err) {
      setError('Ошибка при генерации диалога. Проверьте подключение к серверу.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator">
      <div className="generator-header">
        <h2 className="generator-title">
          <FaComments className="title-icon" />
          Создатель диалогов
        </h2>
        <p className="generator-subtitle">
          Выберите тему и уровень сложности для создания практического диалога
        </p>
      </div>

      <form onSubmit={handleGenerate} className="generator-form">
        <div className="input-group">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Например: в ресторане, на собеседовании, в магазине..."
            className="input-field"
            disabled={loading}
          />
        </div>

        <div className="level-selector">
          <label className="level-label">Уровень сложности:</label>
          <div className="level-buttons">
            {['easy', 'medium', 'hard'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`level-button ${level === lvl ? 'active' : ''}`}
                onClick={() => setLevel(lvl)}
                disabled={loading}
              >
                {lvl === 'easy' && '🟢 Легкий'}
                {lvl === 'medium' && '🟡 Средний'}
                {lvl === 'hard' && '🔴 Сложный'}
              </button>
            ))}
          </div>
        </div>

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
            'Создать диалог'
          )}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {dialogue && (
        <div className="results">
          <h3 className="results-title">{dialogue.title || 'Диалог'}</h3>
          {dialogue.description && (
            <p className="dialogue-description">{dialogue.description}</p>
          )}
          <div className="dialogue-container">
            {dialogue.lines && dialogue.lines.map((line, index) => (
              <div key={index} className={`dialogue-line ${index % 2 === 0 ? 'person-a' : 'person-b'}`}>
                <div className="speaker-name">{line.speaker}</div>
                <div className="dialogue-text">{line.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DialogueGenerator;

