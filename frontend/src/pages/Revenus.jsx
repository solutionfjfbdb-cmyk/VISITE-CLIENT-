import React, { useState, useEffect } from 'react';
import { revenusAPI, categoriesAPI } from '../services/api';
import FormInput from '../components/FormInput';
import '../styles/Pages.css';

function Revenus({ userId }) {
  const [revenus, setRevenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Salaire',
    montant: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadRevenus();
  }, [userId]);

  const loadRevenus = async () => {
    try {
      setLoading(true);
      const response = await revenusAPI.getByUser(userId);
      setRevenus(response.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await revenusAPI.create({
        user_id: userId,
        ...formData,
        montant: parseFloat(formData.montant)
      });
      setFormData({ type: 'Salaire', montant: '', description: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      loadRevenus();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce revenu?')) {
      try {
        await revenusAPI.delete(id);
        loadRevenus();
      } catch (err) {
        console.error('Erreur:', err);
      }
    }
  };

  return (
    <div className="page">
      <h1>💰 Revenus</h1>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '✖️ Annuler' : '➕ Ajouter un revenu'}
      </button>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type de revenu</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            >
              <option>Salaire</option>
              <option>Prime</option>
              <option>Bonus</option>
              <option>Freelance</option>
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
            label="Description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <FormInput
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />

          <button type="submit" className="btn btn-success">💾 Enregistrer</button>
        </form>
      )}

      {loading && <p>Chargement...</p>}

      {revenus.length === 0 && !loading && <p>Aucun revenu enregistré</p>}

      <div className="list">
        {revenus.map(revenu => (
          <div key={revenu.id} className="list-item">
            <div className="item-content">
              <h3>{revenu.type}</h3>
              <p>{revenu.description}</p>
              <small>{revenu.date}</small>
            </div>
            <div className="item-actions">
              <span className="amount">{revenu.montant.toLocaleString()} Ar</span>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(revenu.id)}
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

export default Revenus;
