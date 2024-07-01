const TelegramBot = require('node-telegram-bot-api');
const apiToken = 'XXXXXXXX'; // Replace with your bot API Token
const bot = new TelegramBot(apiToken, { polling: true });

const pingServer = 'XXXXXX';
const DataServer = 'XXXXXX'; // Replace with your public IP Address
const chatId = 'XXXXXXX';

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome", {
    "reply_markup": {
      "keyboard": [["Nearly Expire Products"], ["Expired Products"], ["All Products"]],
      "resize_keyboard": true
    }
  });
}); 

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  console.log(msg.text);

  if (msg.text.toString().toLowerCase().includes('nearly')) {
    nearlyExpiredProducts(chatId);
  }

  if (msg.text.toString().toLowerCase().includes('expired')) {
    expiredProducts(chatId); 
  }

  if (msg.text.toString().toLowerCase().includes('all')) {
    allProductdata(chatId);
    
  }

  if (msg.text.toString().toLowerCase().includes('server_stat')) {
    serverStat(chatId); 
  }
});


const serverStat = async (chatId) => {
  try {
    const response = await fetch(pingServer);
    if (response.ok) {
      const json = await response.json();
      const serverStatus = `Server: ${json.server.charAt(0).toUpperCase() + json.server.slice(1)}`;
      const databaseStatus = `Database: ${json.database.charAt(0).toUpperCase() + json.database.slice(1)}`;
      bot.sendMessage(chatId, `${serverStatus}\n${databaseStatus}`);
    } else {
      bot.sendMessage(chatId, 'Server Offline');
    }
  } catch (error) {
    console.error('Error pinging server:', error);
    bot.sendMessage(chatId, 'Error checking server status');
  }
}

const allProductdata = async (chatId) => { 
  try {
    const response = await fetch(DataServer);
    console.log(response)
    if (response.ok) {
      const json = await response.json();
      let expiredProducts = [];
      let nearlyExpiredProducts = [];
      let farFromExpireProducts = [];

      // Classify products based on expiry date
      json.productData.forEach(product => {
        const expiryDate = new Date(product.expiry_date);
        const today = new Date();
        const diffTime = Math.abs(expiryDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (expiryDate < today) {
          expiredProducts.push(product);
        } else if (diffDays <= 7) {
          nearlyExpiredProducts.push(product);
        } else {
          farFromExpireProducts.push(product);
        }
      });

      // Prepare message with categorized products
      let message = 'All Products:\n';

      if (expiredProducts.length > 0) {
        message += '🔴Expired😖:\n';
        expiredProducts.forEach(product => {
          message += `Name: ${product.Product_name}\n`;
          message += `Expiry Date:${new Date(product.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}\n`;
        });
      }

      if (nearlyExpiredProducts.length > 0) {
        message += '\n🟡Nearly Expire🤨:\n';
        nearlyExpiredProducts.forEach(product => {
          message += `Name: ${product.Product_name}\n`;
          message += `Expiry Date: ${new Date(product.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n`;
        });
      }

      if (farFromExpireProducts.length > 0) {
        message += '\n🟢Fresh for longer😊:\n';
        farFromExpireProducts.forEach(product => {
          message += `Name: ${product.Product_name}\n`;
          message += `Expiry Date: ${new Date(product.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n`;
        });
      }

      // Send message with HTML formatting for color coding
      console.log("Sending....")
      bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    }
  } catch (error) {
    console.error('Error fetching all products:', error);
    bot.sendMessage(chatId, 'Error fetching all products');
  }
}

const nearlyExpiredProducts = async (chatId) => {
  try {
    const response = await fetch(DataServer);
    if (response.ok) {
      const json = await response.json();

      // Ensure json.productData is an array
      if (!Array.isArray(json.productData)) {
        throw new Error('Expected an array for productData but received a different type.');
      }

      const today = new Date();
      const nearlyExpiredProducts = json.productData.filter(product => {
        const expiryDate = new Date(product.expiry_date);
        const diffTime = expiryDate.getTime() - today.getTime(); // Difference in milliseconds
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

        return diffDays <= 7 && diffDays >= 0; // Products expiring within the next 7 days
      });

      if (nearlyExpiredProducts.length === 0) {
        bot.sendMessage(chatId, 'No nearly expired products found.');
      } else {
        let message = 'Nearly Expired Products:\n';
        nearlyExpiredProducts.forEach(product => {
          message += `Name: ${product.Product_name}\n`;
          message += `Expiry Date: ${new Date(product.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n`;
        });
        bot.sendMessage(chatId, message);
      }
    }
  } catch (error) {
    console.error('Error fetching nearly expired products:', error);
    bot.sendMessage(chatId, 'Error fetching nearly expired products');
  }
}


const expiredProducts = async (chatId) => {
  try {
    const response = await fetch(DataServer);
    if (response.ok) {
      const json = await response.json();
      
      // Ensure json.productData is an array
      if (!Array.isArray(json.productData)) {
        throw new Error('Expected an array for productData but received a different type.');
      }
      const expiredProducts = json.productData.filter(product => new Date(product.expiry_date) < new Date());
      if (expiredProducts.length === 0) {
        bot.sendMessage(chatId, 'No expired products found.');
      } else {
        let message = 'Expired Products:\n';
        expiredProducts.forEach(product => {
          const formattedDate = new Date(product.expiry_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
          message += `Name: ${product.Product_name}\nExpiry Date: ${formattedDate}\n\n`;
        });
        bot.sendMessage(chatId, message);
      }
    } else {
      bot.sendMessage(chatId, 'Server Error');
    }
  } catch (error) {
    console.error('Error fetching expired products:', error);
    bot.sendMessage(chatId, 'Error fetching expired products');
  }
}

const expiryCheck = async () => { 
  try {
    const response = await fetch(DataServer);
    if (response.ok) {
      const json = await response.json();
      let expiredProducts = [];
      let nearlyExpiredProducts = [];
      const today = new Date();

      // Classify products based on expiry date
      json.productData.forEach(product => {
        const expiryDate = new Date(product.expiry_date);
        
        const diffTime = Math.abs(expiryDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (expiryDate < today) {
          expiredProducts.push(product);
        } else if (diffDays <= 7) {
          nearlyExpiredProducts.push(product);
        }
      });

      // Prepare message with categorized products
      let message = `${today} Updates:\n`;

      if (expiredProducts.length > 0) {
        message += '🔴Expired😖:\n';
        expiredProducts.forEach(product => {
          message += `Name: ${product.Product_name}\n`;
          message += `Expiry Date:${new Date(product.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}\n`;
        });
      }

      if (nearlyExpiredProducts.length > 0) {
        message += '\n🟡Nearly Expire🤨:\n';
        nearlyExpiredProducts.forEach(product => {
          message += `Name: ${product.Product_name}\n`;
          message += `Expiry Date: ${new Date(product.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}\n`;
        });
      }

      // Send message with HTML formatting for color coding
      bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    }
  } catch (error) {
    console.error('Error fetching all products:', error);
    bot.sendMessage(chatId, 'Error fetching all products');
  }
}



// setInterval(expiryCheck, 60000);
// Handle connection errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.code, error.message);
});

bot.on('error', (error) => {
  console.error('Bot error:', error.code, error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1); // Exit with failure code
});
