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

async function checkProductsQuantity(products) {
  for (let i = 0; i < products.length; i++) {
    const element = products[i];
    const product = await stripe.products.retrieve(element.id)

    if(product.metadata.quantity <= 0){
      throw new Error("%/%Product : " + product.name + " is not available anymore%/%");
    }else if(product.metadata.quantity - element.quantityWanted < 0) {
      throw new Error("%/%Product : " + product.name + " has not enough stock left for your purchase (" + product.metadata.quantity + " left, " + element.quantityWanted + " wanted)%/%");
    }
  }

}

async function createCheckout(request, context) {

  try {
    let siteUrl = context.url.origin;
    let data = await request.json();
    let productsId = data.map((product) => {
      console.log(product)
      return {
        id: product.productId,
        quantityWanted: product.quantity,
      };
    });

    await checkProductsQuantity(productsId); // check if an item is sold out

    let lineItems = formatLineItems(data);

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      currency: "eur",
      shipping_address_collection: {
        allowed_countries: ["BE", "FR"],
      },
      shipping_options: "shr_1RfwqGKz5gaet3BQl6cF9QnC",
      success_url: `${siteUrl}/success/`,
      cancel_url: `${siteUrl}/`,
    });

    return Response.json({ sessionUrl: session.url });
  } catch (err) {
    console.error(err.message);

    throw new Error(err.message)
  }


}

export default createCheckout;
