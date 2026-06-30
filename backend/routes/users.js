const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Créer un utilisateur
router.post('/', async (req, res) => {
  try {
    const { nom, email, devise = 'Ar' } = req.body;
    if (!nom || !email) {
      return res.status(400).json({ error: 'Nom et email requis' });
    }

    await db.run(
      'INSERT INTO users (nom, email, devise) VALUES (?, ?, ?)',
      [nom, email, devise]
    );
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer un utilisateur
router.get('/:id', async (req, res) => {
  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
  try {
    const { nom, email, devise } = req.body;
    await db.run(
      'UPDATE users SET nom = ?, email = ?, devise = ?, date_modification = CURRENT_TIMESTAMP WHERE id = ?',
      [nom, email, devise, req.params.id]
    );
    res.json({ message: 'Utilisateur mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
