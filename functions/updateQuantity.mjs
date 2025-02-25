import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateQuantity(request, context) {

    try {

        let data = await request.json();

        for (let i = 0; i < data.length; i++) {

            const el = data[i]
            const productStock = await stripe.products.retrieve(el.productId)

            await stripe.products.update(el.productId, {
                metadata: { quantity: (productStock.metadata.quantity - el.quantity) >= 0 ? productStock.metadata.quantity - el.quantity : 0}
            });          
        }
      return;
    } catch (err) {
      console.error("Error updating collection:", err);
      throw new Error(err);
    }

  }
  
  export default updateQuantity;
  