import React, { useState, useEffect } from 'react';
import { assurancesAPI } from '../services/api';
import FormInput from '../components/FormInput';
import '../styles/Pages.css';

function Assurances({ userId }) {
  const [assurances, setAssurances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Santé',
    montant: '',
    date_paiement: new Date().toISOString().split('T')[0],
    date_echeance: '',
    description: ''
  });

  useEffect(() => {
    loadAssurances();
  }, [userId]);

  const loadAssurances = async () => {
    try {
      setLoading(true);
      const response = await assurancesAPI.getByUser(userId);
      setAssurances(response.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assurancesAPI.create({
        user_id: userId,
        ...formData,
        montant: parseFloat(formData.montant)
      });
      setFormData({ type: 'Santé', montant: '', date_paiement: new Date().toISOString().split('T')[0], date_echeance: '', description: '' });
      setShowForm(false);
      loadAssurances();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr?')) {
      try {
        await assurancesAPI.delete(id);
        loadAssurances();
      } catch (err) {
        console.error('Erreur:', err);
      }
    }
  };

  return (
    <div className="page">
      <h1>🛡️ Assurances</h1>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '✖️ Annuler' : '➕ Ajouter une assurance'}
      </button>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type d'assurance</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            >
              <option>Santé</option>
              <option>Automobile</option>
              <option>Habitation</option>
              <option>Responsabilité civile</option>
              <option>Autre</option>
            </select>
          </div>

          <FormInput
            label="Montant (Ar)"
            type="number"
            value={formData.montant}
            onChange={(e) => setFormData({...formData, montant: e.target.value})}
            required
          />

          <FormInput
            label="Date de paiement"
            type="date"
            value={formData.date_paiement}
            onChange={(e) => setFormData({...formData, date_paiement: e.target.value})}
            required
          />

          <FormInput
            label="Date d'échéance"
            type="date"
            value={formData.date_echeance}
            onChange={(e) => setFormData({...formData, date_echeance: e.target.value})}
            required
          />

          <FormInput
            label="Description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <button type="submit" className="btn btn-success">💾 Enregistrer</button>
        </form>
      )}

      {loading && <p>Chargement...</p>}

      <div className="list">
        {assurances.map(assurance => (
          <div key={assurance.id} className="list-item">
            <div className="item-content">
              <h3>{assurance.type}</h3>
              <p>{assurance.description}</p>
              <small>Échéance: {assurance.date_echeance}</small>
            </div>
            <div className="item-actions">
              <span className="amount">{assurance.montant.toLocaleString()} Ar</span>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(assurance.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assurances;
