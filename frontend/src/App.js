import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import FeatureCard from './components/FeatureCard';
import EssayGenerator from './components/EssayGenerator';
import DialogueGenerator from './components/DialogueGenerator';
import FillBlankGenerator from './components/FillBlankGenerator';
import GrammarChecker from './components/GrammarChecker';
import StoryGenerator from './components/StoryGenerator';
import Paraphraser from './components/Paraphraser';
import ErrorHunt from './components/ErrorHunt';
import LevelTest from './components/LevelTest';
import { FaPen, FaComments, FaEdit, FaSpellCheck, FaBook, FaExchangeAlt, FaBug, FaGraduationCap } from 'react-icons/fa';

function App() {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 'essay',
      title: 'Essay Topics',
      description: 'Get 5 interesting essay topics based on your keyword',
      icon: <FaPen />,
      color: '#10b981',
      component: EssayGenerator
    },
    {
      id: 'dialogue',
      title: 'Dialogue Creator',
      description: 'Create practice dialogues at your level',
      icon: <FaComments />,
      color: '#3b82f6',
      component: DialogueGenerator
    },
    {
      id: 'fill-blank',
      title: 'Fill the Blank',
      description: 'Practice grammar with AI-generated exercises',
      icon: <FaEdit />,
      color: '#f59e0b',
      component: FillBlankGenerator
    },
    {
      id: 'grammar',
      title: 'Grammar Checker',
      description: 'Check your text for grammar and spelling errors',
      icon: <FaSpellCheck />,
      color: '#ef4444',
      component: GrammarChecker
    },
    {
      id: 'story',
      title: 'Story Generator',
      description: 'Generate short stories for reading practice',
      icon: <FaBook />,
      color: '#8b5cf6',
      component: StoryGenerator
    },
    {
      id: 'paraphrase',
      title: 'Paraphraser',
      description: 'Learn different ways to say the same thing',
      icon: <FaExchangeAlt />,
      color: '#ec4899',
      component: Paraphraser
    },
    {
      id: 'error-hunt',
      title: 'Error Hunt',
      description: 'Find and fix grammar errors in sentences',
      icon: <FaBug />,
      color: '#06b6d4',
      component: ErrorHunt
    },
    {
      id: 'level-test',
      title: 'Level Test',
      description: 'Discover your English level (A1-C2)',
      icon: <FaGraduationCap />,
      color: '#6366f1',
      component: LevelTest
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature);

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        {!activeFeature ? (
          <div className="features-container">
            <div className="hero-section">
              <h1 className="hero-title">
                Изучайте английский с помощью ИИ
              </h1>
              <p className="hero-subtitle">
                Персонализированные упражнения и материалы, созданные искусственным интеллектом специально для вас
              </p>
            </div>

            <div className="features-grid">
              {features.map(feature => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  color={feature.color}
                  onClick={() => setActiveFeature(feature.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="feature-view">
            <button 
              className="back-button"
              onClick={() => setActiveFeature(null)}
            >
              ← Назад к выбору
            </button>
            
            <div className="feature-content">
              {activeFeatureData && React.createElement(activeFeatureData.component)}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 EnglishAI - Powered by OpenAI & MongoDB Atlas</p>
      </footer>
    </div>
  );
}

export default App;

