const cart = document.querySelector("[data-cart]");
//update
export default () => {
  return {
    products: [],
    error: "",

    get totalProducts() {
      return this.products.reduce((accum, item) => accum + item.quantity, 0);
    },

    get totalPrice() {
      return this.products.reduce((accum, item) => accum + item.quantity * parseFloat(item.price), 0).toFixed(2);
    },

    async success() {

      await this.updateProductQuantity();
      this.clearCart();

    },

    async updateProductQuantity() {

      try {
        const response = await fetch("/.netlify/functions/updateQuantity", {
          method: "POST",
          body: JSON.stringify(this.products),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if (!response.ok) {
          throw new Error(response);
        }
  
      } catch (error) {
        throw new Error(error);
      }
    },

    async checkout() {
      // Open a new window immediately (prevents popup blocking)
      const newTab = window.open("", "_blank");
      try {

        const response = await fetch("/.netlify/functions/checkout", {
          method: "POST",
          body: JSON.stringify(this.products),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
    
          throw new Error(errorText);
        }

        let data = await response.json();
        let stripeCheckoutUrl = data.sessionUrl;

        // Redirect the pre-opened tab to Stripe Checkout
        if (newTab) {
          newTab.location.href = stripeCheckoutUrl;
        } else {
          // Fallback: Open in the same window if blocked
          window.location.href = stripeCheckoutUrl;
        }
      } catch (err) {
        newTab.close();
        const errorText = err.toString()
        const match = errorText.split("%/%");
        const cleanErrorMessage = match[1];
        const displayError = cleanErrorMessage;
        this.error = displayError;
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

    clearCart() {
      this.products = [];
    },

    addToCart(data) {
      // build product object
      let product = {
        productId: data.id,
        id: data.priceid,
        priceId: data.priceid,
        name: data.name,
        quantity: parseInt(data.quantity, 10),
        price: (parseInt(data.price, 10) / 100).toFixed(2)
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
