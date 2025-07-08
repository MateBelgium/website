import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event, context) {
  try {
    const data = JSON.parse(event.body);

    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      const productStock = await stripe.products.retrieve(el.productId);
      const currentQuantity = parseInt(productStock.metadata.quantity || 0, 10);
      const newQuantity = Math.max(currentQuantity - el.quantity, 0);

      await stripe.products.update(el.productId, {
        metadata: { quantity: newQuantity.toString() },
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Error updating collection:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Update failed" }),
    };
  }
}