# 🎯 Complete Guide - Pumpfun Live Detector Telegram Bot

## 📋 What Can We Do Here?

This guide explains what you can do with this Telegram bot and how to improve it.

---

## 🤖 Current Features

### What the bot does:

1. **Automatic Contract Detection**
   - Automatically detects Solana addresses (Base58) from 32 to 44 characters
   - Works in Telegram groups and private messages
   - Responds to every message containing an address (no deduplication)

2. **Link Generation**
   - Automatically creates the corresponding pump.fun link
   - Checks if the pump.fun page already exists
   - Displays different messages depending on whether the page exists

3. **Rate Limiting**
   - Limits to 5 links per minute to prevent spam
   - Protection against abuse

4. **Two Deployment Modes**
   - Standalone mode: `bot-pumpfun.js` (for local execution)
   - Serverless mode: `api/bot.js` (for Vercel or other platforms)

---

## 💡 What You Can Do With This Bot

### 1. Basic Usage

**Add the bot to a Telegram group:**
```
1. Create your bot with @BotFather on Telegram
2. Get your token
3. Add the token to the .env file
4. Launch the bot with: node bot-pumpfun.js
5. Add the bot to your group
```

**Use the bot:**
```
Simply send a Solana address in the chat:
AiqBsVpd2wjQRXS7rryguk6WAc3Hp4G1M75o6hLfpump

The bot will respond with:
✅ [View on Pump.fun](https://pump.fun/coin/AiqBsVpd2wjQRXS7rryguk6WAc3Hp4G1M75o6hLf)
```

### 2. Deployment

**Option A: Local Execution**
```bash
npm install
node bot-pumpfun.js
```

**Option B: Serverless Deployment (Vercel)**
```bash
# The api/bot.js file is ready for Vercel
# Just connect your repo to Vercel
# and configure environment variables
```

---

## 🚀 Possible Improvements

### Features to Add:

1. **Enhanced Information**
   - Fetch current token price
   - Display market capitalization
   - Show trading volume
   - Integrate pump.fun API for more details

2. **Alerts and Notifications**
   - Alert system for new tokens
   - Price change notifications
   - Alerts for tokens reaching certain thresholds

3. **Advanced Bot Commands**
   ```javascript
   /start - Start the bot
   /help - Display help
   /stats - Bot statistics
   /subscribe - Subscribe to notifications
   /unsubscribe - Unsubscribe
   ```

4. **Database**
   - Save history of detected tokens
   - User tracking
   - Usage statistics

5. **Social Features**
   - Favorites system
   - Watchlist sharing
   - Token comments and ratings

6. **Enhanced Security**
   - Scam detection
   - Liquidity verification
   - Potential rugpull alerts
   - Smart contract analysis

7. **Multi-Platform**
   - Support for other DEXs (Raydium, Jupiter)
   - Support for other blockchains
   - Aggregation from multiple sources

8. **User Interface**
   - Inline buttons for quick actions
   - Interactive menus
   - Integrated price charts

### Technical Improvements:

1. **Performance**
   - Cache for pump.fun verifications
   - API request optimization
   - Queue system to handle load spikes

2. **Monitoring**
   - Enhanced logging
   - Performance metrics
   - Error alerts

3. **Testing**
   - Unit tests
   - Integration tests
   - Load tests

4. **Documentation**
   - API documentation
   - Developer guide
   - Usage examples

---

## 🛠️ Advanced Configuration

### Environment Variables

```env
# .env
TELEGRAM_TOKEN=your_telegram_token
API_RATE_LIMIT=5
RATE_WINDOW_MS=60000
PUMPFUN_API_KEY=optional
DATABASE_URL=optional
```

### Bot Customization

**Modify messages:**
```javascript
// In bot-pumpfun.js
const messages = {
  detected: '✅ [View on Pump.fun]({url})',
  pending: '🔗 [Pump.fun link]({url})\n_(page not yet available)_',
  error: '❌ Error during verification'
};
```

**Adjust rate limiting:**
```javascript
const RATE_LIMIT = 10; // 10 links per minute
const RATE_WINDOW = 30 * 1000; // 30 seconds
```

---

## 📊 Code Examples for Extensions

### 1. Add a /help Command

```javascript
bot.command('help', (ctx) => {
  ctx.reply(
    '🤖 *Pump.fun Detector Bot*\n\n' +
    'Send a Solana address to get the pump.fun link\n\n' +
    'Commands:\n' +
    '/help - Display this help\n' +
    '/stats - View statistics',
    { parse_mode: 'Markdown' }
  );
});
```

### 2. Add Statistics

```javascript
let stats = { messagesProcessed: 0, linksGenerated: 0 };

bot.command('stats', (ctx) => {
  ctx.reply(
    `📊 *Statistics*\n\n` +
    `Messages processed: ${stats.messagesProcessed}\n` +
    `Links generated: ${stats.linksGenerated}`,
    { parse_mode: 'Markdown' }
  );
});
```

### 3. Integrate Pump.fun API (example)

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

### 4. Add Inline Buttons

```javascript
const { Markup } = require('telegraf');

// In message handler
await ctx.reply(
  `✅ Token detected!`,
  Markup.inlineKeyboard([
    [Markup.button.url('🚀 View on Pump.fun', url)],
    [Markup.button.callback('📊 View stats', `stats_${mint}`)],
    [Markup.button.callback('⭐ Add to favorites', `fav_${mint}`)]
  ])
);
```

---

## 🔧 Development

### Project Structure

```
Pumpfun-live-detector-Tg/
├── bot-pumpfun.js       # Standalone bot
├── api/
│   └── bot.js           # Serverless version
├── package.json
├── .env                 # Configuration
└── README.md
```

### Adding New Features

1. **Create a branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Modify the code**
   - Add logic to `bot-pumpfun.js`
   - Test locally

3. **Test**
   ```bash
   node bot-pumpfun.js
   # Test in Telegram
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add my feature"
   git push
   ```

---

## 📝 Best Practices

1. **Security**
   - Never commit the Telegram token
   - Use environment variables
   - Validate all user inputs

2. **Performance**
   - Limit API calls
   - Use cache when possible
   - Optimize regex patterns

3. **UX**
   - Clear and concise messages
   - Fast responses
   - Elegant error handling

4. **Maintenance**
   - Commented code
   - Informative logs
   - Up-to-date documentation

---

## 🆘 Troubleshooting

### Bot not responding
- Check that the Telegram token is correct
- Verify the bot is running
- Check logs for errors

### Links not working
- Check internet connection
- Verify pump.fun is accessible
- Check logs of the `pumpfunExists` function

### Rate limiting too strict
- Adjust `RATE_LIMIT` and `RATE_WINDOW`
- Consider per-user rate limiting system

---

## 🌟 Contributing

To contribute to the project:

1. Fork the repository
2. Create a branch for your feature
3. Commit your changes
4. Create a Pull Request

---

## 📜 License

MIT License - Free to use and modify

---

## 🔗 Useful Resources

- [Telegraf Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Pump.fun](https://pump.fun/)

---

**Created with ❤️ for the crypto community**
