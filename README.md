# 💰 Gestionnaire de Finances Personnelles

Une application web moderne pour gérer vos revenus, dépenses, épargne et assurance de manière simple et efficace.

## 🎯 Objectifs
- Suivre vos revenus et dépenses mensuels
- Gérer votre épargne avec des objectifs personnalisés
- Visualiser vos données avec des graphiques
- Générer des rapports détaillés
- Définir des rappels d'assurance

## 🚀 Démarrage rapide

### Prérequis
- Node.js 16+
- npm ou yarn
- Base de données SQLite (fournie)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/solutionfjfbdb-cmyk/VISITE-CLIENT-.git

# Installer les dépendances
cd VISITE-CLIENT-
npm install

# Démarrer le serveur
npm start
```

## 📊 Architecture de l'Application

### Frontend
- **Framework**: React.js
- **UI**: Tailwind CSS + Shadcn UI
- **Graphiques**: Chart.js / Recharts

### Backend
- **Framework**: Express.js ou Node.js
- **Base de données**: SQLite
- **API**: RESTful API

## 📁 Structure du Projet

```
VISITE-CLIENT-/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── database/
│   └── server.js
└── README.md
```

## 💡 Fonctionnalités Principales

### 🏠 Tableau de Bord
Résumé complet avec:
- Salaire mensuel
- Autres revenus
- Total des revenus
- Dépenses totales
- Épargne
- Solde disponible

### 💰 Revenus
- Ajouter un salaire
- Ajouter d'autres revenus
- Modifier/supprimer les revenus
- Historique complet

### 💸 Dépenses
Catégories:
- Nourriture
- Transport
- Loyer
- Électricité
- Internet
- Santé
- Loisirs
- Autres dépenses

### 🏦 Épargne
- Ajouter des dépôts
- Définir des objectifs d'épargne
- Suivre la progression

### 🛡️ Assurance
- Ajouter des cotisations
- Historique des paiements
- Rappels d'échéance

### 📊 Rapports
- Dépenses par catégorie
- Revenus par mois
- Évolution du solde
- Évolution de l'épargne

### ⚙️ Paramètres
- Profil utilisateur
- Sélection de devise (Ar, USD, EUR...)
- Export/Sauvegarde des données

## 🔧 Formule de Calcul

```
Solde = (Salaire + Autres revenus) − (Dépenses + Assurance + Épargne)
```

## 📦 Dépendances Principales

- express
- react
- axios
- recharts
- tailwind-css
- sqlite3

## 📝 Licence

MIT
