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

    const productMap = new Map();

    products.data.forEach((product) => {
      const match = product.name.match(/^(.*)\s\[(.*)\]$/);
      const baseName = match ? match[1] : product.name;
      const size = match ? match[2] : null;

      if (!productMap.has(baseName)) {
        productMap.set(baseName, {
          name: baseName,
          description: product.description,
          image: product.images[0] ?? null,
          collection: product.metadata.collection ?? null,
          sizes: [],
        });
      }

      productMap.get(baseName).sizes.push({
        id: product.id,
        size: size || "One Size",
        name: product.name,
        priceId: product.default_price.id,
        priceCurrency: product.default_price.currency,
        priceAmount: product.default_price.unit_amount,
        priceDisplay: formatPrice(product.default_price.unit_amount),
        quantityLeft: product.metadata.quantity ?? null,
      });
    });

    const formattedProducts = Array.from(productMap.values());
    console.log(formattedProducts[0].sizes);
    return formattedProducts;
  } catch (err) {
    throw new Error(err);
  }
}

export default getProducts;
