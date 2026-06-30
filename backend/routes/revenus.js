const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Ajouter un revenu
router.post('/', async (req, res) => {
  try {
    const { user_id, type, montant, description, date } = req.body;
    if (!user_id || !type || !montant || !date) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    await db.run(
      'INSERT INTO revenus (user_id, type, montant, description, date) VALUES (?, ?, ?, ?, ?)',
      [user_id, type, montant, description, date]
    );
    res.status(201).json({ message: 'Revenu ajouté avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les revenus d'un utilisateur
router.get('/user/:user_id', async (req, res) => {
  try {
    const revenus = await db.all(
      'SELECT * FROM revenus WHERE user_id = ? ORDER BY date DESC',
      [req.params.user_id]
    );
    res.json(revenus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer tous les revenus
router.get('/', async (req, res) => {
  try {
    const revenus = await db.all('SELECT * FROM revenus ORDER BY date DESC');
    res.json(revenus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour un revenu
router.put('/:id', async (req, res) => {
  try {
    const { type, montant, description, date } = req.body;
    await db.run(
      'UPDATE revenus SET type = ?, montant = ?, description = ?, date = ? WHERE id = ?',
      [type, montant, description, date, req.params.id]
    );
    res.json({ message: 'Revenu mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un revenu
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM revenus WHERE id = ?', [req.params.id]);
    res.json({ message: 'Revenu supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
