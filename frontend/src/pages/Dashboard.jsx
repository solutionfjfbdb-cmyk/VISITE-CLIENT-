import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import StatCard from '../components/StatCard';
import ExpenseChart from '../components/ExpenseChart';
import '../styles/Dashboard.css';

function Dashboard({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [userId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSummary(userId);
      setData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement du tableau de bord:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;
  if (!data) return <div className="error">Pas de données</div>;

  return (
    <div className="dashboard">
      <h1>📊 Tableau de Bord</h1>
      <p className="month-info">Mois: {data.mois}</p>

      <div className="stats-grid">
        <StatCard 
          title="Salaire"
          value={data.salaire}
          icon="💰"
          className="card-primary"
        />
        <StatCard 
          title="Autres revenus"
          value={data.autresRevenus}
          icon="➕"
          className="card-primary"
        />
        <StatCard 
          title="Total Revenus"
          value={data.totalRevenus}
          icon="📈"
          className="card-success"
        />
        <StatCard 
          title="Dépenses"
          value={data.totalDepenses}
          icon="🛒"
          className="card-danger"
        />
        <StatCard 
          title="Assurance"
          value={data.assurance}
          icon="🛡️"
          className="card-warning"
        />
        <StatCard 
          title="Épargne"
          value={data.epargne}
          icon="🏦"
          className="card-info"
        />
        <StatCard 
          title="Solde Disponible"
          value={data.solde}
          icon="💵"
          className={data.solde >= 0 ? 'card-success' : 'card-danger'}
        />
      </div>

      {data.depensesParCategorie && data.depensesParCategorie.length > 0 && (
        <div className="chart-container">
          <h2>📊 Dépenses par Catégorie</h2>
          <ExpenseChart data={data.depensesParCategorie} />
        </div>
      )}

      {data.objectifEpargne > 0 && (
        <div className="savings-progress">
          <h2>🎯 Objectif d'Épargne</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{
                width: `${Math.min((data.epargne / data.objectifEpargne) * 100, 100)}%`
              }}
            ></div>
          </div>
          <p>{Math.round((data.epargne / data.objectifEpargne) * 100)}% réalisé</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
