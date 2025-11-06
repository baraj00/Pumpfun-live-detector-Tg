// examples/enhanced-bot.js
// Exemple d'amélioration du bot avec des fonctionnalités supplémentaires
// Example of bot enhancement with additional features

require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fetch = require('node-fetch');
const { PublicKey } = require('@solana/web3.js');

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const PUMPFUN_TEMPLATE = 'https://pump.fun/coin/{address}';
const B58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58Regex = new RegExp(`[${B58_ALPHABET}]{32,44}`, 'gi');

// Rate limiter global
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 1000;
let rateTimestamps = [];

// Statistics tracking
let stats = {
  messagesProcessed: 0,
  linksGenerated: 0,
  tokensDetected: 0,
  startTime: Date.now()
};

// User favorites (in-memory, could be replaced with database)
const userFavorites = new Map();

// Validation function
function isValidSolanaPubkey(s) {
  try {
    new PublicKey(s);
    return true;
  } catch {
    return false;
  }
}

// Check if pump.fun page exists
async function pumpfunExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200;
  } catch {
    return false;
  }
}

// Example: Fetch token info (pseudo-code, API may not exist)
async function getTokenInfo(address) {
  try {
    // This is a placeholder - pump.fun may not have a public API
    // Replace with actual API endpoint if available
    const response = await fetch(`https://api.pump.fun/token/${address}`);
    if (response.ok) {
      const data = await response.json();
      return {
        name: data.name || 'Unknown',
        symbol: data.symbol || 'N/A',
        price: data.price || 0,
        marketCap: data.market_cap || 0
      };
    }
  } catch (error) {
    console.log('Token info not available:', error.message);
  }
  return null;
}

// Command: /start
bot.command('start', (ctx) => {
  ctx.reply(
    '🎯 *Bienvenue sur Pump.fun Detector Bot!*\n\n' +
    '🤖 Je détecte automatiquement les adresses Solana et génère les liens pump.fun\n\n' +
    '*Commandes disponibles:*\n' +
    '/help - Afficher l\'aide\n' +
    '/stats - Voir les statistiques\n' +
    '/favorites - Voir vos favoris\n\n' +
    '_Envoyez simplement une adresse Solana pour commencer!_',
    { parse_mode: 'Markdown' }
  );
});

// Command: /help
bot.command('help', (ctx) => {
  ctx.reply(
    '📖 *Guide d\'utilisation*\n\n' +
    '*Comment utiliser le bot:*\n' +
    '1️⃣ Envoyez une adresse Solana (32-44 caractères)\n' +
    '2️⃣ Le bot génère automatiquement le lien pump.fun\n' +
    '3️⃣ Cliquez sur le lien pour voir le token\n\n' +
    '*Commandes:*\n' +
    '/start - Démarrer le bot\n' +
    '/help - Cette aide\n' +
    '/stats - Statistiques du bot\n' +
    '/favorites - Vos tokens favoris\n\n' +
    '*Exemple d\'adresse:*\n' +
    '`AiqBsVpd2wjQRXS7rryguk6WAc3Hp4G1M75o6hLfpump`\n\n' +
    '_Pour plus d\'infos, consultez GUIDE.md_',
    { parse_mode: 'Markdown' }
  );
});

// Command: /stats
bot.command('stats', (ctx) => {
  const uptime = Date.now() - stats.startTime;
  const hours = Math.floor(uptime / (1000 * 60 * 60));
  const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  
  ctx.reply(
    `📊 *Statistiques du Bot*\n\n` +
    `✅ Messages traités: ${stats.messagesProcessed}\n` +
    `🔗 Liens générés: ${stats.linksGenerated}\n` +
    `🎯 Tokens détectés: ${stats.tokensDetected}\n` +
    `⏱️ Uptime: ${hours}h ${minutes}min\n\n` +
    `_Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}_`,
    { parse_mode: 'Markdown' }
  );
});

// Command: /favorites
bot.command('favorites', (ctx) => {
  const userId = ctx.from.id;
  const favorites = userFavorites.get(userId) || [];
  
  if (favorites.length === 0) {
    ctx.reply(
      '⭐ *Vos Favoris*\n\n' +
      'Vous n\'avez pas encore de favoris.\n\n' +
      '_Utilisez le bouton "⭐ Ajouter aux favoris" lors de la détection d\'un token._',
      { parse_mode: 'Markdown' }
    );
  } else {
    let message = '⭐ *Vos Favoris*\n\n';
    favorites.forEach((fav, index) => {
      message += `${index + 1}. [${fav.address.substring(0, 8)}...](${fav.url})\n`;
    });
    ctx.reply(message, { parse_mode: 'Markdown' });
  }
});

// Callback query handler for inline buttons
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;
  const userId = ctx.from.id;
  
  if (data.startsWith('fav_')) {
    const address = data.replace('fav_', '');
    const url = PUMPFUN_TEMPLATE.replace('{address}', address);
    
    if (!userFavorites.has(userId)) {
      userFavorites.set(userId, []);
    }
    
    const favorites = userFavorites.get(userId);
    const exists = favorites.some(f => f.address === address);
    
    if (!exists) {
      favorites.push({ address, url, addedAt: new Date() });
      ctx.answerCbQuery('⭐ Ajouté aux favoris!');
    } else {
      ctx.answerCbQuery('ℹ️ Déjà dans les favoris');
    }
  } else if (data.startsWith('info_')) {
    const address = data.replace('info_', '');
    ctx.answerCbQuery('📊 Récupération des infos...');
    
    const info = await getTokenInfo(address);
    if (info) {
      ctx.reply(
        `📊 *Informations Token*\n\n` +
        `Nom: ${info.name}\n` +
        `Symbol: ${info.symbol}\n` +
        `Prix: $${info.price}\n` +
        `Market Cap: $${info.marketCap.toLocaleString()}`,
        { parse_mode: 'Markdown' }
      );
    } else {
      ctx.reply('❌ Informations non disponibles');
    }
  }
});

// Main message handler with enhanced features
bot.on('message', async (ctx) => {
  try {
    stats.messagesProcessed++;
    
    const text = ctx.message.text || '';
    if (!text) return;
    
    // Rate limiting
    const now = Date.now();
    rateTimestamps = rateTimestamps.filter(ts => now - ts < RATE_WINDOW);
    if (rateTimestamps.length >= RATE_LIMIT) {
      ctx.reply('⚠️ Limite de taux atteinte. Veuillez patienter...');
      return;
    }
    
    // Detect Base58 address
    const m = base58Regex.exec(text);
    if (!m) return;
    
    const mint = m[0];
    stats.tokensDetected++;
    
    // Validate Solana address
    if (!isValidSolanaPubkey(mint)) {
      console.log('Invalid Solana address:', mint);
      return;
    }
    
    const url = PUMPFUN_TEMPLATE.replace('{address}', mint);
    const exists = await pumpfunExists(url);
    
    rateTimestamps.push(now);
    stats.linksGenerated++;
    
    // Create inline keyboard with buttons
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.url('🚀 Voir sur Pump.fun', url)],
      [
        Markup.button.callback('📊 Infos', `info_${mint}`),
        Markup.button.callback('⭐ Favoris', `fav_${mint}`)
      ]
    ]);
    
    if (exists) {
      await ctx.reply(
        `✅ *Token détecté!*\n\n` +
        `Adresse: \`${mint.substring(0, 8)}...${mint.substring(mint.length - 4)}\`\n` +
        `Status: ✅ Page active\n\n` +
        `_Cliquez sur les boutons ci-dessous pour plus d'actions_`,
        { 
          parse_mode: 'Markdown', 
          reply_to_message_id: ctx.message.message_id,
          ...keyboard
        }
      );
    } else {
      await ctx.reply(
        `🔗 *Token détecté!*\n\n` +
        `Adresse: \`${mint.substring(0, 8)}...${mint.substring(mint.length - 4)}\`\n` +
        `Status: ⏳ Page en préparation\n\n` +
        `_La page n'est pas encore disponible_`,
        { 
          parse_mode: 'Markdown', 
          reply_to_message_id: ctx.message.message_id,
          ...keyboard
        }
      );
    }
  } catch (err) {
    console.error('Error handling message:', err);
    ctx.reply('❌ Une erreur s\'est produite. Veuillez réessayer.');
  }
});

// Error handler
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  console.error('Context:', ctx);
});

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('Shutting down gracefully...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  bot.stop('SIGTERM');
});

// Launch the bot
bot.launch();

console.log('🤖 Enhanced Bot Pump.fun prêt!');
console.log('📊 Statistics tracking enabled');
console.log('⭐ Favorites system enabled');
console.log('🔘 Inline buttons enabled');
