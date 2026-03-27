import React, { useState, useEffect } from 'react';
import eventBus from 'shared/eventBus';
import PRODUCTS from 'shared/products';
import './Recommendations.css';

function Recommendations() {
  const [recos, setRecos] = useState(PRODUCTS.slice(0, 3));

    // DONE : adapter les recommandations en fonction du contenu du panier
    useEffect(() => {
        const unsub = eventBus.on('cartUpdated', ({ items }) => {
            const cartIds = items.map(i => Number(i.id));
            const filtered = PRODUCTS.filter(p => !cartIds.includes(p.id)).slice(0, 3);
            setRecos(filtered.length > 0 ? filtered : PRODUCTS.slice(0, 3));
        });

        return () => unsub();
    }, []);

  const handleAddReco = (product) => {
    eventBus.emit('productAdded', product);
  };

  return (
    <div className="recommendations">
      <h2>Les joueurs achetent aussi</h2>
      <div className="reco-list">
        {recos.map(p => (
          <div key={p.id} className="reco-card" onClick={() => handleAddReco(p)}>
            <div className="reco-image" data-category={p.category}>{p.category}</div>
            <span className="reco-name">{p.name}</span>
            <span className="reco-price">{p.price} EUR</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
