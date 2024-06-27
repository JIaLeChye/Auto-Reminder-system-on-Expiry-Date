const TelegramBot = require('node-telegram-bot-api');
const apiToken = '6446905048:XXXXXXXXXXXXXXXXXXXXXXXXXX' // Replace to your bot API Token  
// Replace 'YOUR_BOT_TOKEN' with the actual token of your Telegram bot
const bot = new TelegramBot(apiToken, { polling: true });

// Example sending a message to a specific chat
const chatId = 'XXXXXXXXXXXXXX'; // Replace with the actual chat ID 
const message = 'Hello from your Telegram bot!';

bot.sendMessage(chatId, message)
  .then(() => {
    console.log('Message sent successfully');
  })
  .catch(error => {
    console.error('Error sending message:', error.message);
  });
