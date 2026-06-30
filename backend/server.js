const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialiser la base de données
db.init();

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/revenus', require('./routes/revenus'));
app.use('/api/depenses', require('./routes/depenses'));
app.use('/api/epargne', require('./routes/epargne'));
app.use('/api/assurances', require('./routes/assurances'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'API running', timestamp: new Date() });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

module.exports = app;
