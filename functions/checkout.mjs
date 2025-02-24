import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function formatLineItems(items) {
  let lineItems = [];

  items.forEach((item) => {
    lineItems.push({
      price: item.priceId,
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: 10,
      },
      quantity: item.quantity,
    });
  });

  return lineItems;
}

async function createCheckout(request, context) {
  console.log("caco")
  try {
    let siteUrl = context.url.origin;
    let data = await request.json();
    console.log(data)
    let lineItems = formatLineItems(data);
    console.log(lineItems)

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      currency: "eur",
      shipping_address_collection: {
        allowed_countries: ["BE"],
      },
      success_url: `${siteUrl}/success/`,
      cancel_url: `${siteUrl}/`,
    });

    return Response.json({ sessionUrl: session.url });
  } catch (error) {
    throw new Error(error);
  }
}

export default createCheckout;
