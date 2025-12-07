import React, { useState } from 'react';
import axios from 'axios';
import './Generator.css';
import { FaSpinner, FaGraduationCap, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function LevelTest() {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartTest = async () => {
    setLoading(true);
    setError('');
    setTest(null);
    setAnswers({});
    setResult(null);

    try {
      const response = await axios.post('/api/level-test/generate');
      console.log('Level Test response:', response.data);
      if (response.data && response.data.test && response.data.test.questions) {
        setTest(response.data.test);
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      console.error('Level Test error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error generating test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/level-test/result', {
        answers: Object.values(answers),
        questions: test.questions
      });
      setResult(response.data);
    } catch (err) {
      setError('Error calculating result.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setTest(null);
    setAnswers({});
    setResult(null);
    handleStartTest();
  };

  const levelColors = {
    'A1': '#10b981',
    'A2': '#34d399',
    'B1': '#f59e0b',
    'B2': '#f97316',
    'C1': '#8b5cf6',
    'C2': '#6366f1'
  };

  return (
    <div className="generator">
      <div className="generator-header">
        <h2 className="generator-title">
          <FaGraduationCap className="title-icon" />
          English Level Test
        </h2>
        <p className="generator-subtitle">
          Take a quick test to determine your English level (A1-C2)
        </p>
      </div>

      {!test && !result && (
        <div className="start-test-container">
          <p className="test-info">
            This test contains 10 questions of increasing difficulty.<br/>
            It will take about 5-10 minutes to complete.
          </p>
          <button 
            onClick={handleStartTest} 
            className="submit-button start-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Preparing Test...
              </>
            ) : (
              'Start Test'
            )}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {test && !result && (
        <div className="results">
          <div className="test-progress">
            Question {Object.keys(answers).length} / {test.questions.length}
          </div>

          <div className="questions-container">
            {test.questions.map((q, index) => (
              <div key={index} className="question-card">
                <div className="question-header">
                  <span 
                    className="level-badge"
                    style={{ background: levelColors[q.level] }}
                  >
                    {q.level}
                  </span>
                  <span className="question-number">Question {index + 1}</span>
                </div>
                
                <p className="question-text">{q.question}</p>
                
                <div className="options-grid">
                  {q.options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      className={`option-button ${answers[index] === option ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(index, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="exercise-actions">
            <button 
              className="check-button"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < test.questions.length || loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Calculating...
                </>
              ) : (
                'Submit Test'
              )}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="results">
          <div className="result-header">
            <div 
              className="level-result-circle"
              style={{ background: levelColors[result.estimatedLevel] }}
            >
              {result.estimatedLevel}
            </div>
            <h3>Your Estimated Level</h3>
            <p className="result-percentage">{result.percentage}% correct</p>
            <p className="result-score">{result.totalPoints} / {result.maxPoints} points</p>
          </div>

          <div className="results-breakdown">
            <h4>Results Breakdown:</h4>
            {result.results.map((r, index) => (
              <div key={index} className={`result-item ${r.isCorrect ? 'correct' : 'incorrect'}`}>
                <span className="result-icon">
                  {r.isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                </span>
                <span 
                  className="result-level"
                  style={{ background: levelColors[r.level] }}
                >
                  {r.level}
                </span>
                <span className="result-question">{r.question}</span>
                {!r.isCorrect && (
                  <span className="result-answers">
                    Your: <strong>{r.userAnswer}</strong> | Correct: <strong>{r.correctAnswer}</strong>
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="exercise-actions">
            <button className="reset-button" onClick={handleRetake}>
              Take Another Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LevelTest;

