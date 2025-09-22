
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const { PublicKey } = require('@solana/web3.js');

const PUMPFUN_TEMPLATE = 'https://pump.fun/coin/{address}';
const B58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
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

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.on('message', async (ctx) => {
  try {
    // Récupère le texte du message, même si c'est une entité spéciale (caption, etc.)
    let text = '';
    if (ctx.message.text) {
      text = ctx.message.text;
    } else if (ctx.message.caption) {
      text = ctx.message.caption;
    } else if (ctx.message.entities && ctx.message.entities.length > 0) {
      // Parfois, le texte est dans une entité (ex: bot mentionné)
      text = ctx.message.entities.map(e => e.text).join(' ');
    }
    // Si toujours rien, log pour debug
    if (!text) {
      console.log('Aucun texte détecté dans le message:', ctx.message);
      return;
    }
    const now = Date.now();
    rateTimestamps = rateTimestamps.filter(ts => now - ts < RATE_WINDOW);
    if (rateTimestamps.length >= RATE_LIMIT) return;
    const m = base58Regex.exec(text);
    if (!m) return;
    const mint = m[0];
    const url = PUMPFUN_TEMPLATE.replace('{address}', mint);
    const exists = await pumpfunExists(url);
    rateTimestamps.push(now);
    if (exists) {
      await ctx.reply(
        `✅ [Voir sur Pump.fun](${url})`,
        { parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id }
      );
    } else {
      await ctx.reply(
        `� [Lien pump.fun](${url})\n_(la page n’est pas encore dispo)_`,
        { parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id }
      );
    }
  } catch (err) {
    console.error(err);
  }
});

// Handler Vercel API
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (err) {
      res.status(500).send('Erreur bot: ' + err.message);
    }
  } else {
    res.status(200).send('Bot Telegram webhook');
  }
};
