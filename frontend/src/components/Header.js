import React from 'react';
import './Header.css';
import { FaBrain } from 'react-icons/fa';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <FaBrain className="logo-icon" />
          <span className="logo-text">EnglishAI</span>
        </div>
        <nav className="nav">
          <span className="nav-badge">Powered by AI</span>
        </nav>
      </div>
    </header>
  );
}

export default Header;

