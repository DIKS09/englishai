import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import FeatureCard from './components/FeatureCard';
import EssayGenerator from './components/EssayGenerator';
import DialogueGenerator from './components/DialogueGenerator';
import FillBlankGenerator from './components/FillBlankGenerator';
import { FaPen, FaComments, FaEdit } from 'react-icons/fa';

function App() {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: 'essay',
      title: 'Генератор тем для эссе',
      description: 'Введите ключевое слово и получите 5 интересных тем для написания эссе',
      icon: <FaPen />,
      color: '#10b981',
      component: EssayGenerator
    },
    {
      id: 'dialogue',
      title: 'Создатель диалогов',
      description: 'Выберите тему и уровень сложности для создания практического диалога',
      icon: <FaComments />,
      color: '#3b82f6',
      component: DialogueGenerator
    },
    {
      id: 'fill-blank',
      title: 'Заполни пропуск',
      description: 'Практикуйте грамматику с упражнениями, созданными нейросетью',
      icon: <FaEdit />,
      color: '#f59e0b',
      component: FillBlankGenerator
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

