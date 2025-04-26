const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let cart = [];

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters;

  let responseText = '';

  if (intent === 'Add-To-Cart') {
    const item = parameters.item;
    const price = item === 'Paneer Butter Masala' ? 150 :
                  item === 'Veg Biriyani' ? 120 :
                  item === 'Chicken Biriyani' ? 160 :
                  item === 'Mutton Biriyani' ? 220 : 0;

    cart.push({ item, price });
    responseText = `${item} added to your cart! Want to add more or proceed to checkout?`;
  }

  else if (intent === 'Checkout') {
    if (cart.length === 0) {
      responseText = 'Your cart is empty!';
    } else {
      let total = 0;
      let summary = cart.map(c => {
        total += c.price;
        return `• ${c.item} - ₹${c.price}`;
      }).join('\n');
      responseText = `🛒 Your Order Summary:\n${summary}\nTotal: ₹${total}`;
      cart = [];
    }
  }

  res.json({
    fulfillmentText: responseText
  });
});

app.listen(port, () => {
  console.log(`Webhook server running on http://localhost:${port}`);
});
