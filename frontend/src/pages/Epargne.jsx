import React, { useState, useEffect } from 'react';
import { epargneAPI } from '../services/api';
import FormInput from '../components/FormInput';
import '../styles/Pages.css';

function Epargne({ userId }) {
  const [epargnes, setEpargnes] = useState([]);
  const [total, setTotal] = useState({ total: 0, objectif: 0 });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    montant_depot: '',
    objectif: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await epargneAPI.getByUser(userId);
      const totalResponse = await epargneAPI.getTotal(userId);
      setEpargnes(response.data);
      setTotal(totalResponse.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await epargneAPI.create({
        user_id: userId,
        ...formData,
        montant_depot: parseFloat(formData.montant_depot),
        objectif: formData.objectif ? parseFloat(formData.objectif) : null
      });
      setFormData({ montant_depot: '', objectif: '', description: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <div className="page">
      <h1>🏦 Épargne</h1>

      <div className="stats-summary">
        <div className="stat">
          <span className="label">Épargne Total</span>
          <span className="value">{total.total?.toLocaleString()} Ar</span>
        </div>
        {total.objectif > 0 && (
          <div className="stat">
            <span className="label">Objectif</span>
            <span className="value">{total.objectif?.toLocaleString()} Ar</span>
          </div>
        )}
        {total.progression !== undefined && (
          <div className="stat">
            <span className="label">Progression</span>
            <span className="value">{Math.round(total.progression)}%</span>
          </div>
        )}
      </div>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '✖️ Annuler' : '➕ Ajouter un dépôt'}
      </button>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <FormInput
            label="Montant du dépôt (Ar)"
            type="number"
            value={formData.montant_depot}
            onChange={(e) => setFormData({...formData, montant_depot: e.target.value})}
            required
          />

          <FormInput
            label="Objectif d'épargne (Ar)"
            type="number"
            value={formData.objectif}
            onChange={(e) => setFormData({...formData, objectif: e.target.value})}
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

      <div className="list">
        {epargnes.map(epargne => (
          <div key={epargne.id} className="list-item">
            <div className="item-content">
              <h3>Dépôt d'épargne</h3>
              <p>{epargne.description}</p>
              <small>{epargne.date}</small>
            </div>
            <div className="item-actions">
              <span className="amount">{epargne.montant_depot.toLocaleString()} Ar</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Epargne;
