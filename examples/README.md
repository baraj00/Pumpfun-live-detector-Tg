# 📚 Exemples / Examples

Ce dossier contient des exemples d'améliorations possibles pour le bot Pump.fun Detector.

This folder contains examples of possible improvements for the Pump.fun Detector bot.

---

## 📁 Fichiers / Files

### `enhanced-bot.js`

Version améliorée du bot avec des fonctionnalités supplémentaires :
- ✅ Commandes bot (/start, /help, /stats, /favorites)
- 📊 Suivi des statistiques
- ⭐ Système de favoris
- 🔘 Boutons inline pour actions rapides
- 🛡️ Gestion d'erreurs améliorée
- 📝 Messages formatés avec Markdown

**Comment l'utiliser :**

```bash
# Depuis le dossier racine du projet
node examples/enhanced-bot.js
```

**Fonctionnalités démontrées :**

1. **Commandes disponibles :**
   - `/start` - Message de bienvenue
   - `/help` - Aide détaillée
   - `/stats` - Statistiques d'utilisation
   - `/favorites` - Liste des favoris

2. **Boutons interactifs :**
   - 🚀 Lien direct vers pump.fun
   - 📊 Récupération d'informations (placeholder)
   - ⭐ Ajout aux favoris

3. **Améliorations UX :**
   - Messages plus détaillés
   - Affichage d'adresse tronquée
   - Feedback sur les actions
   - Gestion des limites de taux avec message

---

## 🚀 Comment adapter ces exemples

### 1. Ajouter une base de données

Remplacez le Map en mémoire par une vraie DB :

```javascript
// Exemple avec SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bot.db');

// Créer la table
db.run(`CREATE TABLE IF NOT EXISTS favorites (
  user_id INTEGER,
  address TEXT,
  url TEXT,
  added_at DATETIME
)`);

// Ajouter un favori
function addFavorite(userId, address, url) {
  db.run(
    'INSERT INTO favorites (user_id, address, url, added_at) VALUES (?, ?, ?, ?)',
    [userId, address, url, new Date()]
  );
}
```

### 2. Intégrer une vraie API

```javascript
async function getTokenInfo(address) {
  try {
    // Exemple avec une API réelle
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`
    );
    const data = await response.json();
    return {
      name: data.pairs[0]?.baseToken.name,
      symbol: data.pairs[0]?.baseToken.symbol,
      price: data.pairs[0]?.priceUsd,
      liquidity: data.pairs[0]?.liquidity.usd
    };
  } catch (error) {
    return null;
  }
}
```

### 3. Ajouter des alertes de prix

```javascript
const priceAlerts = new Map(); // userId -> [{ address, targetPrice }]

// Fonction pour vérifier les alertes
setInterval(async () => {
  for (const [userId, alerts] of priceAlerts) {
    for (const alert of alerts) {
      const info = await getTokenInfo(alert.address);
      if (info && info.price >= alert.targetPrice) {
        bot.telegram.sendMessage(
          userId,
          `🚨 Alerte Prix!\n\nLe token ${alert.address} a atteint ${info.price}$`
        );
      }
    }
  }
}, 60000); // Vérifier toutes les minutes
```

### 4. Ajouter des graphiques

```javascript
// Utiliser une bibliothèque de graphiques
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

async function generatePriceChart(priceHistory) {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });
  
  const configuration = {
    type: 'line',
    data: {
      labels: priceHistory.map(p => p.timestamp),
      datasets: [{
        label: 'Prix',
        data: priceHistory.map(p => p.price),
        borderColor: 'rgb(75, 192, 192)',
      }]
    }
  };
  
  return await chartJSNodeCanvas.renderToBuffer(configuration);
}
```

---

## ⚠️ Notes importantes

1. **API Limitations :** Les exemples utilisent des APIs placeholder. Vérifiez la disponibilité et les limites des APIs réelles.

2. **Rate Limiting :** Respectez les limites des APIs tierces pour éviter d'être bloqué.

3. **Sécurité :** Ne stockez jamais de clés API ou tokens dans le code. Utilisez toujours des variables d'environnement.

4. **Performance :** Pour un bot en production, considérez l'utilisation de workers et queues pour gérer les pics de charge.

5. **Données persistantes :** Les exemples utilisent des structures en mémoire qui seront perdues au redémarrage. Utilisez une vraie base de données pour la production.

---

## 📖 Ressources supplémentaires

- [Telegraf Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Guide Complet](../GUIDE.md)
- [Complete Guide (EN)](../GUIDE_EN.md)

---

**Ces exemples sont fournis à titre éducatif. Adaptez-les selon vos besoins!**
