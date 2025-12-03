import React, { useState } from 'react';
import axios from 'axios';
import './Generator.css';
import { FaSpinner, FaBook } from 'react-icons/fa';

function StoryGenerator() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('medium');
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setStory(null);

    try {
      const response = await axios.post('/api/story/generate', { topic, level });
      setStory(response.data.story);
    } catch (err) {
      setError('Error generating story. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator">
      <div className="generator-header">
        <h2 className="generator-title">
          <FaBook className="title-icon" />
          Story Generator
        </h2>
        <p className="generator-subtitle">
          Choose a topic and level to generate a short story for reading practice
        </p>
      </div>

      <form onSubmit={handleGenerate} className="generator-form">
        <div className="input-group">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic: adventure, friendship, mystery..."
            className="input-field"
            disabled={loading}
          />
        </div>

        <div className="level-selector">
          <label className="level-label">Reading Level:</label>
          <div className="level-buttons">
            {['easy', 'medium', 'hard'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`level-button ${level === lvl ? 'active' : ''}`}
                onClick={() => setLevel(lvl)}
                disabled={loading}
              >
                {lvl === 'easy' && '🟢 Easy (A1-A2)'}
                {lvl === 'medium' && '🟡 Medium (B1-B2)'}
                {lvl === 'hard' && '🔴 Hard (C1-C2)'}
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
              Generating...
            </>
          ) : (
            'Generate Story'
          )}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {story && (
        <div className="results">
          <h3 className="story-title">{story.title}</h3>
          
          <div className="story-content">
            <p className="story-text">{story.story}</p>
          </div>

          {story.vocabulary && story.vocabulary.length > 0 && (
            <div className="vocabulary-section">
              <h4>📚 New Vocabulary:</h4>
              <div className="vocabulary-grid">
                {story.vocabulary.map((item, index) => (
                  <div key={index} className="vocabulary-card">
                    <span className="vocab-word">{item.word}</span>
                    <span className="vocab-translation">{item.translation}</span>
                    <span className="vocab-definition">{item.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {story.questions && story.questions.length > 0 && (
            <div className="questions-section">
              <h4>❓ Comprehension Questions:</h4>
              <ol className="questions-list">
                {story.questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StoryGenerator;

