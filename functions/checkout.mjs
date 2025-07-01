import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Format cart items into Stripe line items
 */
function formatLineItems(items) {
  return items.map((item) => ({
    price: item.priceId,
    adjustable_quantity: {
      enabled: true,
      minimum: 1,
      maximum: 10,
    },
    quantity: item.quantity,
  }));
}

/**
 * Check product quantity via metadata
 */
async function checkProductsQuantity(products) {
  for (const element of products) {
    const product = await stripe.products.retrieve(element.id);

    const quantityLeft = parseInt(product.metadata.quantity, 10);

    if (quantityLeft <= 0) {
      throw new Error(
        `%/%Product : ${product.name} is not available anymore%/%`
      );
    } else if (quantityLeft - element.quantityWanted < 0) {
      throw new Error(
        `%/%Product : ${product.name} has not enough stock left for your purchase (${quantityLeft} left, ${element.quantityWanted} wanted)%/%`
      );
    }
  }
}

/**
 * Netlify serverless function
 */
export async function handler(event, context) {
  try {
    const data = JSON.parse(event.body || "[]");

    const productsId = data.map((product) => ({
      id: product.productId,
      quantityWanted: product.quantity,
    }));

    await checkProductsQuantity(productsId);

    const lineItems = formatLineItems(data);

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      currency: "eur",
      shipping_address_collection: {
        allowed_countries: ["BE", "FR"],
      },
      shipping_options: [{ shipping_rate: "shr_1RfwqGKz5gaet3BQl6cF9QnC" }],
      success_url: `${event.headers.origin || "https://matebelgium.com"}/success/`,
      cancel_url: `${event.headers.origin || "https://matebelgium.com"}/`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionUrl: session.url }),
    };
  } catch (err) {
    console.error("Checkout error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
