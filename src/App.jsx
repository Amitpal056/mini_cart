import { useEffect, useState } from "react";
import "./App.css";

const CART_KEY = "morrow-cart";
const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isCartPage = window.location.pathname === "/cart";

  useEffect(() => {
    let isCurrent = true;

    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("The product catalog could not be loaded.");
        return response.json();
      })
      .then((items) => {
        if (isCurrent) setProducts(items);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item._id === product._id);
      if (existingItem) {
        return currentCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity + change } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="store-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Morrow home">Ecommerce<span>.</span></a>
        <nav aria-label="Main navigation">
          <a className={!isCartPage ? "nav-link active" : "nav-link"} href="/">Shop</a>
          <a className={isCartPage ? "nav-link active" : "nav-link"} href="/cart">
            Bag <span className="cart-count">{cartCount}</span>
          </a>
        </nav>
      </header>

      {isCartPage ? (
        <main className="cart-page">
          <div className="page-heading">
            <p className="eyebrow">YOUR SELECTION</p>
            <h1>Your bag<span>.</span></h1>
          </div>
          {cart.length === 0 ? (
            <div className="empty-state">
              <p>Your bag is taking a quiet moment.</p>
              <a className="text-link" href="/">Explore the collection <span>↗</span></a>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                {cart.map((item) => (
                  <article className="cart-item" key={item._id}>
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-info">
                      <p className="item-category">{item.category}</p>
                      <h2>{item.name}</h2>
                      <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                        <button onClick={() => updateQuantity(item._id, -1)} aria-label="Decrease quantity">−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} aria-label="Increase quantity">+</button>
                      </div>
                    </div>
                    <p className="cart-item-price">{formatPrice(item.price * item.quantity)}</p>
                  </article>
                ))}
              </div>
              <aside className="order-summary">
                <p className="eyebrow">ORDER SUMMARY</p>
                <div className="summary-line"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                <div className="summary-line"><span>Shipping</span><span>Calculated later</span></div>
                <div className="summary-total"><span>Total</span><strong>{formatPrice(cartTotal)}</strong></div>
                <p className="checkout-note">This demo ends at the bag. No payment required.</p>
              </aside>
            </div>
          )}
        </main>
      ) : (
        <main>

          <section className="collection" aria-label="Product collection">
            <div className="collection-heading">
              <h2>The collection</h2>
              <span>{products.length.toString().padStart(2, "0")} OBJECTS</span>
            </div>
            {loading ? (
              <p className="status-message">Gathering the collection...</p>
            ) : error ? (
              <div className="status-message error-message">
                <p>{error}</p>
                <p>Start the API and connect MongoDB to see products.</p>
              </div>
            ) : products.length === 0 ? (
              <p className="status-message">No products are available yet.</p>
            ) : (
              <div className="product-grid">
                {products.map((product, index) => (
                  <article className="product-card" key={product._id}>
                    <div className="product-image-wrap">
                      <img src={product.image} alt={product.name} loading="lazy" />
                      <span className="product-number">0{index + 1}</span>
                      <button className="add-button" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}>
                        <span>+</span>
                      </button>
                    </div>
                    <div className="product-details">
                      <div><p className="item-category">{product.category}</p><h3>{product.name}</h3></div>
                      <p className="product-price">{formatPrice(product.price)}</p>
                    </div>
                    <p className="product-description">{product.description}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      
    </div>
  );
}

export default App;
