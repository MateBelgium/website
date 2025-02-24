const cart = document.querySelector("[data-cart]");

export default () => {
  return {
    products: [],

    get totalProducts() {
      return this.products.reduce((accum, item) => accum + item.quantity, 0);
    },

    async checkout() {
      try {
        const response = await fetch("/.netlify/functions/checkout", {
          method: "POST",
          body: JSON.stringify(this.products),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        let data = await response.json();
        let stripeCheckoutUrl = data.sessionUrl;

        window.open(stripeCheckoutUrl);
      } catch (error) {
        throw new Error(error);
      }
    },

    openCart() {
      cart.showModal();
    },

    closeCart() {
      cart.close();
    },

    deleteFromCart(id) {
      this.products = this.products.filter((item) => item.id !== id);
    },

    addToCart(data) {
      // build product object
      let product = {
        id: data.priceid,
        priceId: data.priceid,
        name: data.name,
        quantity: parseInt(data.quantity, 10),
      };

      // add to cart if id does not exist yet
      // otherwise update quantity
      if (!this.products.some((item) => item.id === product.id)) {
        this.products = [...this.products, product];
      } else {
        this.products = this.products.map((item) => {
          if (item.id === product.id) {
            item.quantity++;
          }
          return item;
        });
      }
    },

    // Called with x-effect: every time reactive data used inside that function changes, the function is ran automatically (here when this.products changes)
    syncCart() {
      let jsonProducts = JSON.stringify(this.products);
      window.localStorage.setItem("myCart", jsonProducts);
    },

    // called automatically when script is initiated
    init() {
      this.products = JSON.parse(window.localStorage.getItem("myCart")) ?? [];
    },
  };
};
