// bot-pumpfun.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch'); // Node <18
const { PublicKey } = require('@solana/web3.js');

const BOT_TOKEN = process.env.TELEGRAM_TOKEN; // <-- Mets ton token ici
const bot = new Telegraf(BOT_TOKEN);

const PUMPFUN_TEMPLATE = 'https://pump.fun/coin/{address}';
const B58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
// On détecte toute séquence Base58 de 32 à 44 caractères (y compris 'pump' si présent dans la clé)
const base58Regex = new RegExp(`[${B58_ALPHABET}]{32,44}`, 'gi');



// Rate limiter global (max 5 liens/minute)
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 1000; // 1 min
let rateTimestamps = [];

function isValidSolanaPubkey(s) {
  try {
    new PublicKey(s);
    return true;
  } catch {
    return false;
  }
}

async function pumpfunExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200;
  } catch {
    return false;
  }
}



// Handler principal
bot.on('message', async (ctx) => {
  try {
    // DEBUG : log tous les messages reçus
    console.log('Message reçu:', ctx.message);
    const text = ctx.message.text || '';
    console.log('DEBUG texte reçu:', JSON.stringify(text));
    // Rate limiter global
    const now = Date.now();
    rateTimestamps = rateTimestamps.filter(ts => now - ts < RATE_WINDOW);
    if (rateTimestamps.length >= RATE_LIMIT) return; // trop de liens récemment
    // On détecte la première séquence Base58 (32-44 chars)
    const m = base58Regex.exec(text);
    console.log('DEBUG regex:', m);
    if (!m) return;
    const mint = m[0];
    console.log('DEBUG mint extrait:', mint);
    // Plus de déduplication : le bot répond à chaque fois
    const url = PUMPFUN_TEMPLATE.replace('{address}', mint);
    const exists = await pumpfunExists(url);
    console.log('DEBUG url:', url, 'exists:', exists);
    rateTimestamps.push(now);
    if (exists) {
      console.log('DEBUG: réponse pump.fun détecté');
      await ctx.reply(
        `✅ [Voir sur Pump.fun](${url})`,
        { parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id }
      );
    } else {
      console.log('DEBUG: réponse lien préparé');
      await ctx.reply(
        `� [Lien pump.fun](${url})\n_(la page n’est pas encore dispo)_`,
        { parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id }
      );
    }
  } catch (err) {
    console.error(err);
  }
});

// Lancer le bot
bot.launch();

console.log('Bot Pump.fun prêt !');
