import React, { useState } from 'react';
import axios from 'axios';
import './Generator.css';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaSpellCheck } from 'react-icons/fa';

function GrammarChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to check');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/grammar/check', { text });
      setResult(response.data.result);
    } catch (err) {
      setError('Error checking grammar. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator">
      <div className="generator-header">
        <h2 className="generator-title">
          <FaSpellCheck className="title-icon" />
          Grammar Checker
        </h2>
        <p className="generator-subtitle">
          Enter your text and AI will check for grammar, spelling, and style errors
        </p>
      </div>

      <form onSubmit={handleCheck} className="generator-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your English text here... (e.g., 'I goes to school yesterday and I see my friend.')"
          className="input-textarea"
          rows={6}
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
              Checking...
            </>
          ) : (
            'Check Grammar'
          )}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="results">
          <div className="score-box">
            <div className="score-circle" style={{
              background: result.overallScore >= 80 ? '#10b981' : 
                         result.overallScore >= 50 ? '#f59e0b' : '#ef4444'
            }}>
              {result.overallScore}%
            </div>
            <span className="score-label">Score</span>
          </div>

          {result.correctedText && (
            <div className="corrected-text-box">
              <h4>Corrected Text:</h4>
              <p className="corrected-text">{result.correctedText}</p>
            </div>
          )}

          {result.errors && result.errors.length > 0 && (
            <div className="errors-list">
              <h4>Errors Found ({result.errors.length}):</h4>
              {result.errors.map((err, index) => (
                <div key={index} className="error-item">
                  <div className="error-header">
                    <FaTimesCircle className="error-icon" />
                    <span className="error-original">"{err.original}"</span>
                    <span className="error-arrow">→</span>
                    <FaCheckCircle className="correct-icon" />
                    <span className="error-correction">"{err.correction}"</span>
                  </div>
                  <p className="error-explanation">{err.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {result.tips && result.tips.length > 0 && (
            <div className="tips-box">
              <h4>💡 Tips:</h4>
              <ul>
                {result.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GrammarChecker;

