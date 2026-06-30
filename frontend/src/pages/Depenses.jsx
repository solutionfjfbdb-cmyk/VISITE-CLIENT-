import React, { useState, useEffect } from 'react';
import { depensesAPI, categoriesAPI } from '../services/api';
import FormInput from '../components/FormInput';
import '../styles/Pages.css';

function Depenses({ userId }) {
  const [depenses, setDepenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category_id: '',
    montant: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const depResponse = await depensesAPI.getByUser(userId);
      const catResponse = await categoriesAPI.getByType('depense');
      setDepenses(depResponse.data);
      setCategories(catResponse.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await depensesAPI.create({
        user_id: userId,
        ...formData,
        montant: parseFloat(formData.montant),
        category_id: parseInt(formData.category_id)
      });
      setFormData({ category_id: '', montant: '', description: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      loadData();
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense?')) {
      try {
        await depensesAPI.delete(id);
        loadData();
      } catch (err) {
        console.error('Erreur:', err);
      }
    }
  };

  return (
    <div className="page">
      <h1>💸 Dépenses</h1>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '✖️ Annuler' : '➕ Ajouter une dépense'}
      </button>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Catégorie</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.nom}
                </option>
              ))}
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

      <div className="list">
        {depenses.map(depense => (
          <div key={depense.id} className="list-item">
            <div className="item-content">
              <h3>{depense.categorie}</h3>
              <p>{depense.description}</p>
              <small>{depense.date}</small>
            </div>
            <div className="item-actions">
              <span className="amount">{depense.montant.toLocaleString()} Ar</span>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(depense.id)}
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

export default Depenses;
