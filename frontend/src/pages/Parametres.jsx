import React, { useState } from 'react';
import { usersAPI } from '../services/api';
import FormInput from '../components/FormInput';
import '../styles/Pages.css';

function Parametres({ userId }) {
  const [devise, setDevise] = useState('Ar');
  const [message, setMessage] = useState('');

  const handleSaveSettings = async () => {
    try {
      await usersAPI.update(userId, { devise });
      setMessage('✅ Paramètres sauvegardés avec succès!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Erreur lors de la sauvegarde');
    }
  };

  const handleExportData = () => {
    // Implémenter l'export des données
    alert('Fonction d\'export à venir');
  };

  return (
    <div className="page">
      <h1>⚙️ Paramètres</h1>

      {message && <div className="message">{message}</div>}

      <div className="settings-section">
        <h2>Profil</h2>
        <div className="form-group">
          <label>Devise</label>
          <select value={devise} onChange={(e) => setDevise(e.target.value)}>
            <option value="Ar">Ariary (Ar)</option>
            <option value="USD">Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">Livre (£)</option>
          </select>
        </div>
        <button className="btn btn-success" onClick={handleSaveSettings}>
          💾 Enregistrer les paramètres
        </button>
      </div>

      <div className="settings-section">
        <h2>Données</h2>
        <button className="btn btn-primary" onClick={handleExportData}>
          📥 Exporter les données
        </button>
      </div>

      <div className="settings-section">
        <h2>À propos</h2>
        <p>💰 Gestionnaire de Finances Personnelles v1.0.0</p>
        <p>Une application web pour gérer vos finances au quotidien.</p>
      </div>
    </div>
  );
}

export default Parametres;
