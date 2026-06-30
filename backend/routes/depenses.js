const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Ajouter une dépense
router.post('/', async (req, res) => {
  try {
    const { user_id, category_id, montant, description, date } = req.body;
    if (!user_id || !category_id || !montant || !date) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    await db.run(
      'INSERT INTO depenses (user_id, category_id, montant, description, date) VALUES (?, ?, ?, ?, ?)',
      [user_id, category_id, montant, description, date]
    );
    res.status(201).json({ message: 'Dépense ajoutée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les dépenses d'un utilisateur
router.get('/user/:user_id', async (req, res) => {
  try {
    const depenses = await db.all(
      `SELECT d.*, c.nom as categorie FROM depenses d
       LEFT JOIN categories c ON d.category_id = c.id
       WHERE d.user_id = ?
       ORDER BY d.date DESC`,
      [req.params.user_id]
    );
    res.json(depenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer dépenses par catégorie
router.get('/user/:user_id/by-category', async (req, res) => {
  try {
    const depenses = await db.all(
      `SELECT c.nom, SUM(d.montant) as total, COUNT(d.id) as nombre
       FROM depenses d
       LEFT JOIN categories c ON d.category_id = c.id
       WHERE d.user_id = ?
       GROUP BY d.category_id
       ORDER BY total DESC`,
      [req.params.user_id]
    );
    res.json(depenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour une dépense
router.put('/:id', async (req, res) => {
  try {
    const { category_id, montant, description, date } = req.body;
    await db.run(
      'UPDATE depenses SET category_id = ?, montant = ?, description = ?, date = ? WHERE id = ?',
      [category_id, montant, description, date, req.params.id]
    );
    res.json({ message: 'Dépense mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une dépense
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM depenses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Dépense supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
