const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Ajouter une assurance
router.post('/', async (req, res) => {
  try {
    const { user_id, type, montant, date_paiement, date_echeance, description } = req.body;
    if (!user_id || !type || !montant || !date_paiement || !date_echeance) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    await db.run(
      'INSERT INTO assurances (user_id, type, montant, date_paiement, date_echeance, description) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, type, montant, date_paiement, date_echeance, description]
    );
    res.status(201).json({ message: 'Assurance ajoutée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les assurances d'un utilisateur
router.get('/user/:user_id', async (req, res) => {
  try {
    const assurances = await db.all(
      'SELECT * FROM assurances WHERE user_id = ? ORDER BY date_echeance ASC',
      [req.params.user_id]
    );
    res.json(assurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer assurances actives (non expirées)
router.get('/user/:user_id/actives', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const assurances = await db.all(
      'SELECT * FROM assurances WHERE user_id = ? AND date_echeance >= ? ORDER BY date_echeance ASC',
      [req.params.user_id, today]
    );
    res.json(assurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Total cotisations mensuelles
router.get('/user/:user_id/total', async (req, res) => {
  try {
    const result = await db.get(
      'SELECT SUM(montant) as total FROM assurances WHERE user_id = ? AND statut = "payee"',
      [req.params.user_id]
    );
    res.json({ total: result.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour une assurance
router.put('/:id', async (req, res) => {
  try {
    const { type, montant, date_paiement, date_echeance, statut, description } = req.body;
    await db.run(
      'UPDATE assurances SET type = ?, montant = ?, date_paiement = ?, date_echeance = ?, statut = ?, description = ? WHERE id = ?',
      [type, montant, date_paiement, date_echeance, statut, description, req.params.id]
    );
    res.json({ message: 'Assurance mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une assurance
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM assurances WHERE id = ?', [req.params.id]);
    res.json({ message: 'Assurance supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
