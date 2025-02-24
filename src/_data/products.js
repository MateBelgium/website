import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function formatPrice(nbr, currency = "eur", locale = "fr-BE") {
  let decimalNbr = nbr / 100;
  let formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });

  return formatter.format(decimalNbr);
}

async function getProducts() {
  try {
    const products = await stripe.products.list({
      limit: 10,
      expand: ["data.default_price"],
    });

    const formattedProducts = products.data.map((product) => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        priceId: product.default_price.id,
        priceCurrency: product.default_price.currency,
        priceAmount: product.default_price.unit_amount,
        priceDisplay: formatPrice(product.default_price.unit_amount),
        image: product.images[0] ?? null,
      };
    });

    return formattedProducts;
  } catch (err) {
    throw new Error(err);
  }
}

export default getProducts;
