import React, { useState, useEffect } from 'react';
import './App.css';
import eventBus from "shared/eventBus";

function LoadingFallback({ name }) {
  return <div className="loading-fallback">Chargement {name}...</div>;
}

function OfflineFallback({ name }) {
    return <div className="offline-fallback">Service {name} indisponible</div>;
}

function RemoteMFE({ name, importFn }) {
    const [Component, setComponent] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        importFn()
         .then((mod) => {
             if (!cancelled) { setComponent(() => mod.default); setLoading(false); }
             })
         .catch((err) => {
               console.warn(`[MFE] ${name} indisponible :`, err.message);
           if (!cancelled) { setError(true); setLoading(false); }
             });
        return () => { cancelled = true; };
    }, [name, importFn]);

    if (loading) return <LoadingFallback name={name} />;
    if (error || !Component) return <OfflineFallback name={name} />;
    return <Component />;
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
              <RemoteMFE name="Products" importFn={() => import('mfeProduct/ProductGrid')} />
          }
        </section>
        <aside className="cart-area">
          {
              /* DONE : afficher mfe-cart avec Suspense */
              <RemoteMFE name="Cart" importFn={() => import('mfeCart/Cart')} />
          }
        </aside>
      </main>
      <section className="reco-area">
        {
            /* DONE : afficher mfe-reco avec Suspense */
            <RemoteMFE name="Recommendations" importFn={() => import('mfeReco/Recommendations')} />
        }
      </section>
    </div>
  );
}

export default App;
