import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Revenus from './pages/Revenus';
import Depenses from './pages/Depenses';
import Epargne from './pages/Epargne';
import Assurances from './pages/Assurances';
import Rapports from './pages/Rapports';
import Parametres from './pages/Parametres';
import './styles/App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userId, setUserId] = useState(1);

  const menuItems = [
    { path: '/', label: '🏠 Tableau de bord', icon: 'home' },
    { path: '/revenus', label: '💰 Revenus', icon: 'income' },
    { path: '/depenses', label: '💸 Dépenses', icon: 'expenses' },
    { path: '/epargne', label: '🏦 Épargne', icon: 'savings' },
    { path: '/assurances', label: '🛡️ Assurances', icon: 'insurance' },
    { path: '/rapports', label: '📊 Rapports', icon: 'reports' },
    { path: '/parametres', label: '⚙️ Paramètres', icon: 'settings' }
  ];

  return (
    <Router>
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <h1>💰 Finance Manager</h1>
            </div>
            <button 
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        <div className="container">
          {/* Sidebar */}
          <nav className={`sidebar ${menuOpen ? 'open' : ''}`}>
            <ul className="menu">
              {menuItems.map(item => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard userId={userId} />} />
              <Route path="/revenus" element={<Revenus userId={userId} />} />
              <Route path="/depenses" element={<Depenses userId={userId} />} />
              <Route path="/epargne" element={<Epargne userId={userId} />} />
              <Route path="/assurances" element={<Assurances userId={userId} />} />
              <Route path="/rapports" element={<Rapports userId={userId} />} />
              <Route path="/parametres" element={<Parametres userId={userId} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
