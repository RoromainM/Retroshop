import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import eventBus from "shared/eventBus";

// DONE : importer les 3 MFEs avec React.lazy()
const Cart = React.lazy(() => import("mfeCart/Cart"));
const Products = React.lazy(() => import("mfeProduct/ProductGrid"));
const Reco = React.lazy(() => import("mfeReco/Recommendations"));

function LoadingFallback({ name }) {
  return <div className="loading-fallback">Chargement {name}...</div>;
}

class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) return <div>Service indisponible</div>;
        return this.props.children;
    }
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // DONE : ecouter les mises a jour du panier pour le badge
    const unsubscribe = eventBus.on("cartUpdated", (data) =>{
        setCartCount(data.count);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="shell">
      <header className="shell-header">
        <h1 className="logo">RetroShop</h1>
        <div className="cart-badge">Panier ({cartCount})</div>
      </header>
      <main className="shell-main">
        <section className="product-area">
          {
              /* DONE : afficher mfe-product avec Suspense */
              <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback name="Products" />}>
                      <Products />
                  </Suspense>
              </ErrorBoundary>
          }
        </section>
        <aside className="cart-area">
          {
              /* DONE : afficher mfe-cart avec Suspense */
              <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback name="Cart" />}>
                      <Cart />
                  </Suspense>
              </ErrorBoundary>
          }
        </aside>
      </main>
      <section className="reco-area">
        {
            /* DONE : afficher mfe-reco avec Suspense */
            <ErrorBoundary>
                <Suspense fallback={<LoadingFallback name="Recommendations" />}>
                    <Reco />
                </Suspense>
            </ErrorBoundary>
        }
      </section>
    </div>
  );
}

export default App;
