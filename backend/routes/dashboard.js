const express = require('express');
const router = express.Router();
const db = require('../database/init');

// Récupérer le résumé du tableau de bord
router.get('/:user_id', async (req, res) => {
  try {
    const userId = req.params.user_id;
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const currentMonth = `${year}-${month}`;

    // Salaire
    const salaire = await db.get(
      `SELECT SUM(montant) as total FROM revenus 
       WHERE user_id = ? AND type = 'Salaire' AND strftime('%Y-%m', date) = ?`,
      [userId, currentMonth]
    );

    // Autres revenus
    const autresRevenus = await db.get(
      `SELECT SUM(montant) as total FROM revenus 
       WHERE user_id = ? AND type != 'Salaire' AND strftime('%Y-%m', date) = ?`,
      [userId, currentMonth]
    );

    // Total dépenses
    const totalDepenses = await db.get(
      `SELECT SUM(montant) as total FROM depenses 
       WHERE user_id = ? AND strftime('%Y-%m', date) = ?`,
      [userId, currentMonth]
    );

    // Dépenses par catégorie
    const depensesParCategorie = await db.all(
      `SELECT c.nom, c.icon, SUM(d.montant) as montant FROM depenses d
       LEFT JOIN categories c ON d.category_id = c.id
       WHERE d.user_id = ? AND strftime('%Y-%m', d.date) = ?
       GROUP BY d.category_id
       ORDER BY montant DESC`,
      [userId, currentMonth]
    );

    // Total épargne
    const totalEpargne = await db.get(
      `SELECT SUM(montant_depot) as total, MAX(objectif) as objectif FROM epargne 
       WHERE user_id = ?`,
      [userId]
    );

    // Total assurances
    const totalAssurances = await db.get(
      `SELECT SUM(montant) as total FROM assurances 
       WHERE user_id = ? AND strftime('%Y-%m', date_paiement) = ?`,
      [userId, currentMonth]
    );

    const salaireMontant = salaire.total || 0;
    const autreRevenuMontant = autresRevenus.total || 0;
    const totalRevenuMontant = salaireMontant + autreRevenuMontant;
    const depenseMontant = totalDepenses.total || 0;
    const epargneeMontant = totalEpargne.total || 0;
    const assuranceMontant = totalAssurances.total || 0;
    const solde = totalRevenuMontant - (depenseMontant + epargneeMontant + assuranceMontant);

    res.json({
      salaire: salaireMontant,
      autresRevenus: autreRevenuMontant,
      totalRevenus: totalRevenuMontant,
      totalDepenses: depenseMontant,
      depensesParCategorie: depensesParCategorie || [],
      epargne: epargneeMontant,
      objectifEpargne: totalEpargne.objectif || 0,
      assurance: assuranceMontant,
      solde: solde,
      mois: currentMonth
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer l'historique sur 12 mois
router.get('/:user_id/historique', async (req, res) => {
  try {
    const userId = req.params.user_id;
    const historique = await db.all(
      `SELECT strftime('%Y-%m', date) as mois, SUM(montant) as total FROM revenus
       WHERE user_id = ?
       GROUP BY strftime('%Y-%m', date)
       ORDER BY mois DESC
       LIMIT 12`,
      [userId]
    );
    res.json(historique);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
