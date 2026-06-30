import React, { useState, useEffect } from 'react';
import { depensesAPI, revenusAPI, epargneAPI, dashboardAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import '../styles/Pages.css';

function Rapports({ userId }) {
  const [rapports, setRapports] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRapports();
  }, [userId]);

  const loadRapports = async () => {
    try {
      setLoading(true);
      const depResponse = await depensesAPI.getByCategory(userId);
      const revResponse = await revenusAPI.getByUser(userId);
      const epgResponse = await epargneAPI.getByUser(userId);
      const histResponse = await dashboardAPI.getHistorique(userId);

      setRapports({
        depenses: depResponse.data,
        revenus: revResponse.data,
        epargnes: epgResponse.data,
        historique: histResponse.data
      });
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA502', '#6C5CE7', '#00B894', '#FDCB6E', '#95A5A6'];

  if (loading) return <div className="page"><p>Chargement des rapports...</p></div>;
  if (!rapports) return <div className="page"><p>Aucune donnée</p></div>;

  return (
    <div className="page">
      <h1>📊 Rapports</h1>

      {rapports.depenses && rapports.depenses.length > 0 && (
        <div className="rapport-section">
          <h2>Dépenses par Catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rapports.depenses}
                dataKey="total"
                nameKey="nom"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {rapports.depenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {rapports.historique && rapports.historique.length > 0 && (
        <div className="rapport-section">
          <h2>Revenus par Mois</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rapports.historique}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#27AE60" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rapport-stats">
        <h2>Résumé des Dépenses</h2>
        {rapports.depenses && rapports.depenses.map((dep, idx) => (
          <div key={idx} className="stat-item">
            <span>{dep.nom}</span>
            <span className="amount">{dep.total.toLocaleString()} Ar</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rapports;
