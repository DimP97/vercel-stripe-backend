import Stripe from 'stripe';

const stripe = new Stripe(process.env.sk_test_51LuN9REhwn37jzSpGXIWWdJQFa3n80mUrWuliAHpSpJDPvC2OuvzKOafRBOjf5lncEpH40BDouZRJPseqp0jsDJU00ijc0v8dj);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.price_1RZvHCEhwn37jzSpwbKI7Qal,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
