import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.sk_test_51LuN9REhwn37jzSpGXIWWdJQFa3n80mUrWuliAHpSpJDPvC2OuvzKOafRBOjf5lncEpH40BDouZRJPseqp0jsDJU00ijc0v8dj);

export const config = {
  api: {
    bodyParser: false,
  },
};

const generateLicenseKey = () => {
  return [...Array(25)].map(() => Math.random().toString(36)[2]).join('').toUpperCase();
};

const licenses = {}; // TEMP storage — replace with database later

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.whsec_88e5b2e7436c69230e812a55e1ba5c6e62cf7ca042d344657eaf675763bb3efe);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_email;

    const licenseKey = generateLicenseKey();
    licenses[licenseKey] = {
      email: customerEmail,
      created: Date.now(),
      valid: true,
    };

    console.log(`New license generated: ${licenseKey} for ${customerEmail}`);
  }

  res.json({ received: true });
}
