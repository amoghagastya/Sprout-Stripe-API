const express = require('express');

const app = express();
const router = express.Router();

const serverless = require('serverless-http');
const { resolve } = require('path');
require('dotenv').config({ path: './.env' });

// Ensure environment variables are set.
// checkEnv();
app.use(express.json());

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const YOUR_DOMAIN = 'http://sprout.ae';



router.post('/stripe-checkout', async (req, res) => {
  const total = req.body.total;
  const name = req.body.name;
  const email = req.body.email;
  const user_cart = req.body.cart;
  // const woo_id = req.body.id;
  var session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // TODO: replace this with the `price` of the product you want to sell
        amount : total,
        currency : "inr",
        name : "" + name + "'s Sprout Order",
        quantity : 1,
        description : "Payment for cart items " + user_cart
      },
    ],
    payment_method_types: [
      'card',
    ],
    mode: 'payment',
    success_url: `https://localhost:9000`,
    cancel_url: `https://sprout.ae`,
    customer_email: email
  });

  // session["woo_id"] = woo_id;
  // res.redirect(303, session.url)
  console.log(session)
  return res.status(200).send(session)
});


app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
// app.listen(4242, () => console.log('Running on port 4242'));