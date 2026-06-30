const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Ajouter une épargne
router.post('/', async (req, res) => {
  try {
    const { user_id, montant_depot, objectif, description, date } = req.body;
    if (!user_id || !montant_depot || !date) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    await db.run(
      'INSERT INTO epargne (user_id, montant_depot, objectif, description, date) VALUES (?, ?, ?, ?, ?)',
      [user_id, montant_depot, objectif, description, date]
    );
    res.status(201).json({ message: 'Épargne ajoutée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer l'épargne d'un utilisateur
router.get('/user/:user_id', async (req, res) => {
  try {
    const epargnes = await db.all(
      'SELECT * FROM epargne WHERE user_id = ? ORDER BY date DESC',
      [req.params.user_id]
    );
    res.json(epargnes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Total épargné
router.get('/user/:user_id/total', async (req, res) => {
  try {
    const result = await db.get(
      'SELECT SUM(montant_depot) as total, MAX(objectif) as objectif FROM epargne WHERE user_id = ?',
      [req.params.user_id]
    );
    res.json({
      total: result.total || 0,
      objectif: result.objectif || 0,
      progression: result.objectif ? (result.total / result.objectif * 100) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour l'objectif
router.put('/:id', async (req, res) => {
  try {
    const { montant_depot, objectif, description, date } = req.body;
    await db.run(
      'UPDATE epargne SET montant_depot = ?, objectif = ?, description = ?, date = ? WHERE id = ?',
      [montant_depot, objectif, description, date, req.params.id]
    );
    res.json({ message: 'Épargne mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une épargne
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM epargne WHERE id = ?', [req.params.id]);
    res.json({ message: 'Épargne supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
