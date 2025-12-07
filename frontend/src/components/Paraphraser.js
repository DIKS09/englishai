import React, { useState } from 'react';
import axios from 'axios';
import './Generator.css';
import { FaSpinner, FaExchangeAlt } from 'react-icons/fa';

function Paraphraser() {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParaphrase = async (e) => {
    e.preventDefault();
    
    if (!sentence.trim()) {
      setError('Please enter a sentence to paraphrase');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('/api/paraphrase/generate', { sentence });
      console.log('Paraphrase response:', response.data);
      if (response.data && response.data.result) {
        setResult(response.data.result);
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      console.error('Paraphrase error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error paraphrasing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styleColors = {
    formal: '#3b82f6',
    casual: '#10b981',
    simple: '#f59e0b',
    advanced: '#8b5cf6',
    creative: '#ec4899'
  };

  return (
    <div className="generator">
      <div className="generator-header">
        <h2 className="generator-title">
          <FaExchangeAlt className="title-icon" />
          Paraphraser
        </h2>
        <p className="generator-subtitle">
          Enter a sentence and get 5 different ways to say the same thing
        </p>
      </div>

      <form onSubmit={handleParaphrase} className="generator-form">
        <div className="input-group">
          <input
            type="text"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Enter a sentence: I like to eat pizza every day"
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
                Processing...
              </>
            ) : (
              'Paraphrase'
            )}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="results">
          <div className="original-sentence">
            <span className="label">Original:</span>
            <span className="text">"{result.original}"</span>
          </div>

          <h3 className="results-title">Alternative Ways to Say It:</h3>
          
          <div className="paraphrases-grid">
            {result.paraphrases && result.paraphrases.map((item, index) => (
              <div 
                key={index} 
                className="paraphrase-card"
                style={{ borderLeftColor: styleColors[item.style] || '#6366f1' }}
              >
                <span 
                  className="style-badge"
                  style={{ background: styleColors[item.style] || '#6366f1' }}
                >
                  {item.style}
                </span>
                <p className="paraphrase-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Paraphraser;

