const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// To store cart data session-wise (simple in-memory)
const sessions = {};

app.use(bodyParser.json());

// Handle webhook POST
app.post('/', (req, res) => {
    const body = req.body;

    const session = body.session;
    const queryText = body.queryResult.queryText;
    const intentName = body.queryResult.intent.displayName;

    if (!sessions[session]) {
        sessions[session] = {
            cart: [],
            totalPrice: 0
        };
    }

    if (intentName === 'Veg Menu') {
        const selectedDish = queryText;
        const menu = {
            "Paneer Butter Masala": 180,
            "Veg Biryani": 150,
            "Dal Makhani": 120
        };

        if (menu[selectedDish]) {
            sessions[session].cart.push({ name: selectedDish, price: menu[selectedDish] });
            sessions[session].totalPrice += menu[selectedDish];

            return res.json({
                fulfillmentMessages: [
                    {
                        text: {
                            text: [
                                `${selectedDish} has been added to your cart!`
                            ]
                        }
                    },
                    {
                        payload: {
                            richContent: [
                                [
                                    {
                                        type: "chips",
                                        options: [
                                            { text: "Add another item" },
                                            { text: "Proceed to checkout" }
                                        ]
                                    }
                                ]
                            ]
                        }
                    }
                ]
            });
        }
    }

    else if (intentName === 'Non Veg Menu') {
        const selectedDish = queryText;
        const menu = {
            "Chicken Biriyani": 160,
            "Mutton Biriyani": 220,
            "Fish Fry": 500
        };

        if (menu[selectedDish]) {
            sessions[session].cart.push({ name: selectedDish, price: menu[selectedDish] });
            sessions[session].totalPrice += menu[selectedDish];

            return res.json({
                fulfillmentMessages: [
                    {
                        text: {
                            text: [
                                `${selectedDish} has been added to your cart!`
                            ]
                        }
                    },
                    {
                        payload: {
                            richContent: [
                                [
                                    {
                                        type: "chips",
                                        options: [
                                            { text: "Add another item" },
                                            { text: "Proceed to checkout" }
                                        ]
                                    }
                                ]
                            ]
                        }
                    }
                ]
            });
        }
    }

    else if (intentName === 'Add another item') {
        return res.json({
            fulfillmentMessages: [
                {
                    text: {
                        text: [
                            "Great! Please select from Veg or Non-Veg menu again."
                        ]
                    }
                },
                {
                    payload: {
                        richContent: [
                            [
                                {
                                    type: "chips",
                                    options: [
                                        { text: "Veg" },
                                        { text: "Non-Veg" }
                                    ]
                                }
                            ]
                        ]
                    }
                }
            ]
        });
    }

    else if (intentName === 'Proceed to checkout') {
        const cart = sessions[session].cart;
        const total = sessions[session].totalPrice;

        if (cart.length === 0) {
            return res.json({
                fulfillmentMessages: [
                    {
                        text: {
                            text: ["Your cart is empty!"]
                        }
                    }
                ]
            });
        }

        let summary = "Here's your order summary:\n";
        cart.forEach((item, index) => {
            summary += `${index + 1}. ${item.name} - ₹${item.price}\n`;
        });
        summary += `\nTotal Amount: ₹${total}`;

        // Clear cart after checkout (optional)
        delete sessions[session];

        return res.json({
            fulfillmentMessages: [
                {
                    text: {
                        text: [summary]
                    }
                },
                {
                    text: {
                        text: ["Thank you for ordering! 🍽️"]
                    }
                }
            ]
        });
    }

    else {
        // Default fallback
        return res.json({
            fulfillmentMessages: [
                {
                    text: {
                        text: [
                            "Sorry, I didn't understand that."
                        ]
                    }
                }
            ]
        });
    }
});

app.get('/', (req, res) => {
    res.send('Food Bot Webhook is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
