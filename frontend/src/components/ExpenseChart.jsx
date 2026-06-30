import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA502', '#6C5CE7', '#00B894', '#FDCB6E', '#95A5A6'];

function ExpenseChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          dataKey="montant"
          label={({ nom, montant }) => `${nom}: ${montant.toLocaleString()} Ar`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value.toLocaleString()} Ar`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ExpenseChart;
