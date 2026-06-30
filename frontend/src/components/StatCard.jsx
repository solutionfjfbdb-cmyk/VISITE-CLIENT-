import React from 'react';

function StatCard({ title, value, icon, className = '' }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value?.toLocaleString() || 0} Ar</p>
      </div>
    </div>
  );
}

export default StatCard;
