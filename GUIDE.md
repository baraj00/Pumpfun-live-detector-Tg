# 🎯 Guide Complet - Pumpfun Live Detector Telegram Bot

## 📋 Que peut-on faire ici ? / What can we do here?

Ce guide explique ce que vous pouvez faire avec ce bot Telegram et comment l'améliorer.

---

## 🤖 Fonctionnalités Actuelles

### Ce que le bot fait :

1. **Détection Automatique de Contracts**
   - Détecte automatiquement les adresses Solana (Base58) de 32 à 44 caractères
   - Fonctionne dans les groupes Telegram et messages privés
   - Répond à chaque message contenant une adresse (pas de déduplication)

2. **Génération de Liens**
   - Crée automatiquement le lien pump.fun correspondant
   - Vérifie si la page pump.fun existe déjà
   - Affiche un message différent selon que la page existe ou non

3. **Rate Limiting**
   - Limite à 5 liens par minute pour éviter le spam
   - Protection contre l'abus

4. **Deux Modes de Déploiement**
   - Mode standalone : `bot-pumpfun.js` (pour exécution locale)
   - Mode serverless : `api/bot.js` (pour Vercel ou autres plateformes)

---

## 💡 Ce que vous pouvez faire avec ce bot

### 1. Utilisation Basique

**Ajouter le bot à un groupe Telegram :**
```
1. Créez votre bot avec @BotFather sur Telegram
2. Récupérez votre token
3. Ajoutez le token dans le fichier .env
4. Lancez le bot avec : node bot-pumpfun.js
5. Ajoutez le bot à votre groupe
```

**Utiliser le bot :**
```
Envoyez simplement une adresse Solana dans le chat :
AiqBsVpd2wjQRXS7rryguk6WAc3Hp4G1M75o6hLfpump

Le bot répondra avec :
✅ [Voir sur Pump.fun](https://pump.fun/coin/AiqBsVpd2wjQRXS7rryguk6WAc3Hp4G1M75o6hLf)
```

### 2. Déploiement

**Option A : Exécution Locale**
```bash
npm install
node bot-pumpfun.js
```

**Option B : Déploiement Serverless (Vercel)**
```bash
# Le fichier api/bot.js est prêt pour Vercel
# Il suffit de connecter votre repo à Vercel
# et de configurer les variables d'environnement
```

---

## 🚀 Améliorations Possibles

### Fonctionnalités à Ajouter :

1. **Informations Enrichies**
   - Récupérer le prix actuel du token
   - Afficher la capitalisation du marché
   - Montrer le volume de trading
   - Intégrer l'API pump.fun pour plus de détails

2. **Alertes et Notifications**
   - Système d'alertes pour nouveaux tokens
   - Notifications de variation de prix
   - Alerte pour tokens atteignant certains seuils

3. **Commandes Bot Avancées**
   ```javascript
   /start - Démarrer le bot
   /help - Afficher l'aide
   /stats - Statistiques du bot
   /subscribe - S'abonner aux notifications
   /unsubscribe - Se désabonner
   ```

4. **Base de Données**
   - Sauvegarder l'historique des tokens détectés
   - Tracking des utilisateurs
   - Statistiques d'utilisation

5. **Fonctionnalités Sociales**
   - Système de favoris
   - Partage de watchlist
   - Commentaires et ratings des tokens

6. **Sécurité Améliorée**
   - Détection de scams
   - Vérification de liquidité
   - Alertes de rugpull potentiels
   - Analyse de contrat intelligent

7. **Multi-Plateformes**
   - Support pour d'autres DEX (Raydium, Jupiter)
   - Support pour d'autres blockchains
   - Agrégation de plusieurs sources

8. **Interface Utilisateur**
   - Boutons inline pour actions rapides
   - Menus interactifs
   - Graphiques de prix intégrés

### Améliorations Techniques :

1. **Performance**
   - Cache pour les vérifications pump.fun
   - Optimisation des requêtes API
   - Queue système pour gérer les pics de charge

2. **Monitoring**
   - Logging amélioré
   - Métriques de performance
   - Alertes d'erreur

3. **Tests**
   - Tests unitaires
   - Tests d'intégration
   - Tests de charge

4. **Documentation**
   - API documentation
   - Guide du développeur
   - Exemples d'utilisation

---

## 🛠️ Configuration Avancée

### Variables d'Environnement

```env
# .env
TELEGRAM_TOKEN=votre_token_telegram
API_RATE_LIMIT=5
RATE_WINDOW_MS=60000
PUMPFUN_API_KEY=optionnel
DATABASE_URL=optionnel
```

### Personnalisation du Bot

**Modifier les messages :**
```javascript
// Dans bot-pumpfun.js
const messages = {
  detected: '✅ [Voir sur Pump.fun]({url})',
  pending: '🔗 [Lien pump.fun]({url})\n_(la page n\'est pas encore dispo)_',
  error: '❌ Erreur lors de la vérification'
};
```

**Ajuster le rate limiting :**
```javascript
const RATE_LIMIT = 10; // 10 liens par minute
const RATE_WINDOW = 30 * 1000; // 30 secondes
```

---

## 📊 Exemples de Code pour Extensions

### 1. Ajouter une Commande /help

```javascript
bot.command('help', (ctx) => {
  ctx.reply(
    '🤖 *Bot Pump.fun Detector*\n\n' +
    'Envoyez une adresse Solana pour obtenir le lien pump.fun\n\n' +
    'Commandes:\n' +
    '/help - Afficher cette aide\n' +
    '/stats - Voir les statistiques',
    { parse_mode: 'Markdown' }
  );
});
```

### 2. Ajouter des Statistiques

```javascript
let stats = { messagesProcessed: 0, linksGenerated: 0 };

bot.command('stats', (ctx) => {
  ctx.reply(
    `📊 *Statistiques*\n\n` +
    `Messages traités: ${stats.messagesProcessed}\n` +
    `Liens générés: ${stats.linksGenerated}`,
    { parse_mode: 'Markdown' }
  );
});
```

### 3. Intégrer l'API Pump.fun (exemple)

```javascript
async function getTokenInfo(address) {
  try {
    const response = await fetch(`https://api.pump.fun/token/${address}`);
    const data = await response.json();
    return {
      name: data.name,
      symbol: data.symbol,
      price: data.price,
      marketCap: data.market_cap
    };
  } catch (error) {
    return null;
  }
}
```

### 4. Ajouter des Boutons Inline

```javascript
const { Markup } = require('telegraf');

// Dans le handler de message
await ctx.reply(
  `✅ Token détecté!`,
  Markup.inlineKeyboard([
    [Markup.button.url('🚀 Voir sur Pump.fun', url)],
    [Markup.button.callback('📊 Voir les stats', `stats_${mint}`)],
    [Markup.button.callback('⭐ Ajouter aux favoris', `fav_${mint}`)]
  ])
);
```

---

## 🔧 Développement

### Structure du Projet

```
Pumpfun-live-detector-Tg/
├── bot-pumpfun.js       # Bot standalone
├── api/
│   └── bot.js           # Version serverless
├── package.json
├── .env                 # Configuration
└── README.md
```

### Ajouter de Nouvelles Fonctionnalités

1. **Créer une branche**
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

2. **Modifier le code**
   - Ajouter la logique dans `bot-pumpfun.js`
   - Tester localement

3. **Tester**
   ```bash
   node bot-pumpfun.js
   # Testez dans Telegram
   ```

4. **Commiter et pusher**
   ```bash
   git add .
   git commit -m "Ajout de ma fonctionnalité"
   git push
   ```

---

## 📝 Bonnes Pratiques

1. **Sécurité**
   - Ne jamais commiter le token Telegram
   - Utiliser des variables d'environnement
   - Valider toutes les entrées utilisateur

2. **Performance**
   - Limiter les appels API
   - Utiliser un cache quand possible
   - Optimiser les regex

3. **UX**
   - Messages clairs et concis
   - Réponses rapides
   - Gestion des erreurs élégante

4. **Maintenance**
   - Code commenté
   - Logs informatifs
   - Documentation à jour

---

## 🆘 Dépannage

### Le bot ne répond pas
- Vérifiez que le token Telegram est correct
- Vérifiez que le bot est bien lancé
- Consultez les logs pour les erreurs

### Les liens ne fonctionnent pas
- Vérifiez la connexion internet
- Vérifiez que pump.fun est accessible
- Consultez les logs de la fonction `pumpfunExists`

### Rate limiting trop strict
- Ajustez `RATE_LIMIT` et `RATE_WINDOW`
- Considérez un système de rate limiting par utilisateur

---

## 🌟 Contributions

Pour contribuer au projet :

1. Fork le repository
2. Créez une branche pour votre fonctionnalité
3. Commitez vos changements
4. Créez une Pull Request

---

## 📜 Licence

MIT License - Libre d'utilisation et modification

---

## 🔗 Ressources Utiles

- [Documentation Telegraf](https://telegraf.js.org/)
- [API Telegram Bot](https://core.telegram.org/bots/api)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Pump.fun](https://pump.fun/)

---

**Créé avec ❤️ pour la communauté crypto**
