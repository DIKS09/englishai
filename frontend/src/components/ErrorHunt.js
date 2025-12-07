import React, { useState } from 'react';
import axios from 'axios';
import './Generator.css';
import { FaSpinner, FaBug, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function ErrorHunt() {
  const [grammar, setGrammar] = useState('');
  const [exercises, setExercises] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!grammar.trim()) {
      setError('Please enter a grammar topic');
      return;
    }

    setLoading(true);
    setError('');
    setExercises([]);
    setUserAnswers({});
    setShowResults(false);

    try {
      const response = await axios.post('/api/error-hunt/generate', { grammar, count: 5 });
      setExercises(response.data.exercises);
    } catch (err) {
      setError('Error generating exercises. Please try again.');
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

  // Normalize answer to handle contractions
  const normalizeAnswer = (answer) => {
    const contractions = {
      "haven't": "have not", "hasn't": "has not", "hadn't": "had not",
      "don't": "do not", "doesn't": "does not", "didn't": "did not",
      "won't": "will not", "wouldn't": "would not", "can't": "cannot",
      "couldn't": "could not", "shouldn't": "should not", "mustn't": "must not",
      "isn't": "is not", "aren't": "are not", "wasn't": "was not", "weren't": "were not",
      "i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is",
      "it's": "it is", "we're": "we are", "they're": "they are",
      "i've": "i have", "you've": "you have", "we've": "we have", "they've": "they have",
      "i'll": "i will", "you'll": "you will", "he'll": "he will", "she'll": "she will",
      "we'll": "we will", "they'll": "they will", "i'd": "i would", "you'd": "you would",
      "he'd": "he would", "she'd": "she would", "we'd": "we would", "they'd": "they would"
    };
    
    let normalized = answer.trim().toLowerCase();
    const expandedForms = {};
    for (const [contraction, full] of Object.entries(contractions)) {
      expandedForms[full] = contraction;
    }
    
    return {
      original: normalized,
      expanded: contractions[normalized] || normalized,
      contracted: expandedForms[normalized] || normalized
    };
  };

  const isCorrect = (index) => {
    const userAnswer = (userAnswers[index] || '').trim().toLowerCase();
    const correctAnswer = exercises[index].correctWord.trim().toLowerCase();
    
    if (userAnswer === correctAnswer) return true;
    
    const userNorm = normalizeAnswer(userAnswer);
    const correctNorm = normalizeAnswer(correctAnswer);
    
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
          <FaBug className="title-icon" />
          Error Hunt
        </h2>
        <p className="generator-subtitle">
          Find and fix the grammar error in each sentence
        </p>
      </div>

      <form onSubmit={handleGenerate} className="generator-form">
        <div className="input-group">
          <input
            type="text"
            value={grammar}
            onChange={(e) => setGrammar(e.target.value)}
            placeholder="Enter grammar topic: verb tenses, articles, prepositions..."
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
                Generating...
              </>
            ) : (
              'Generate Exercises'
            )}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {exercises.length > 0 && (
        <div className="results">
          <h3 className="results-title">Find the Error:</h3>
          
          <div className="exercises-container">
            {exercises.map((exercise, index) => (
              <div key={index} className="exercise-card error-hunt-card">
                <div className="exercise-number">Question {index + 1}</div>
                <p className="error-sentence">
                  🔍 "{exercise.sentenceWithError}"
                </p>
                
                <div className="error-hunt-input">
                  <label>The wrong word is:</label>
                  <input
                    type="text"
                    value={userAnswers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Type the correct word"
                    disabled={showResults}
                    className={`blank-input ${
                      showResults 
                        ? isCorrect(index) 
                          ? 'correct' 
                          : 'incorrect'
                        : ''
                    }`}
                  />
                </div>

                {showResults && (
                  <div className={`result-feedback ${isCorrect(index) ? 'correct' : 'incorrect'}`}>
                    {isCorrect(index) ? (
                      <>
                        <FaCheckCircle /> Correct!
                      </>
                    ) : (
                      <>
                        <FaTimesCircle /> 
                        <span>
                          Error: "<strong>{exercise.errorWord}</strong>" → 
                          Correct: "<strong>{exercise.correctWord}</strong>"
                        </span>
                      </>
                    )}
                    <p className="error-explanation">
                      ✅ {exercise.correctSentence}
                    </p>
                    <p className="error-explanation">
                      💡 {exercise.explanation}
                    </p>
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
                Check Answers
              </button>
            ) : (
              <button 
                className="reset-button"
                onClick={handleReset}
              >
                Try Again
              </button>
            )}
          </div>

          {showResults && (
            <div className="score-summary">
              Score: {exercises.filter((_, i) => isCorrect(i)).length} / {exercises.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ErrorHunt;

