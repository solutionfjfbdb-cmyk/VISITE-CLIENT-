const express = require('express');
const router = express.Router();
const db = require('../database/init');

const defaultCategories = [
  { nom: 'Nourriture', icon: '🍔', couleur: '#FF6B6B', type: 'depense' },
  { nom: 'Transport', icon: '🚗', couleur: '#4ECDC4', type: 'depense' },
  { nom: 'Loyer', icon: '🏠', couleur: '#45B7D1', type: 'depense' },
  { nom: 'Électricité', icon: '💡', couleur: '#FFA502', type: 'depense' },
  { nom: 'Internet', icon: '📡', couleur: '#6C5CE7', type: 'depense' },
  { nom: 'Santé', icon: '⚕️', couleur: '#00B894', type: 'depense' },
  { nom: 'Loisirs', icon: '🎮', couleur: '#FDCB6E', type: 'depense' },
  { nom: 'Autres', icon: '📦', couleur: '#95A5A6', type: 'depense' },
  { nom: 'Salaire', icon: '💰', couleur: '#27AE60', type: 'revenu' },
  { nom: 'Autres revenus', icon: '➕', couleur: '#2980B9', type: 'revenu' }
];

// Initialiser les catégories par défaut
router.get('/init', async (req, res) => {
  try {
    for (const cat of defaultCategories) {
      await db.run(
        'INSERT OR IGNORE INTO categories (nom, icon, couleur, type) VALUES (?, ?, ?, ?)',
        [cat.nom, cat.icon, cat.couleur, cat.type]
      );
    }
    res.json({ message: 'Catégories initialisées' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await db.all('SELECT * FROM categories ORDER BY type, nom');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer catégories par type
router.get('/type/:type', async (req, res) => {
  try {
    const categories = await db.all(
      'SELECT * FROM categories WHERE type = ? ORDER BY nom',
      [req.params.type]
    );
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter une catégorie
router.post('/', async (req, res) => {
  try {
    const { nom, icon, couleur, type } = req.body;
    if (!nom || !type) {
      return res.status(400).json({ error: 'Nom et type requis' });
    }

    await db.run(
      'INSERT INTO categories (nom, icon, couleur, type) VALUES (?, ?, ?, ?)',
      [nom, icon, couleur, type]
    );
    res.status(201).json({ message: 'Catégorie créée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour une catégorie
router.put('/:id', async (req, res) => {
  try {
    const { nom, icon, couleur, type } = req.body;
    await db.run(
      'UPDATE categories SET nom = ?, icon = ?, couleur = ?, type = ? WHERE id = ?',
      [nom, icon, couleur, type, req.params.id]
    );
    res.json({ message: 'Catégorie mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une catégorie
router.delete('/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
