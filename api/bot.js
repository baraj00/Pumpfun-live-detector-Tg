const { Telegraf } = require('telegraf');

// Récupère le token du bot depuis les variables d'environnement
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Exemple de handler (à adapter selon ton bot)
bot.on('text', async (ctx) => {
  await ctx.reply('Bot en ligne sur Vercel !');
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
