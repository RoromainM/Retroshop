import React, { useState, useEffect } from 'react';
import eventBus from 'shared/eventBus';
import PRODUCTS from 'shared/products';
import './Recommendations.css';

function Recommendations() {
  const [recos, setRecos] = useState(PRODUCTS.slice(0, 3));

  useEffect(() => {
    // TODO: adapter les recommandations en fonction du contenu du panier
    const productOnCart = eventBus.on('productAdded', (product) => {
      console.log('Product added to cart:', product);
    });

    setRecos(PRODUCTS.filter(p => p.name != productOnCart.name).slice(0, 3));

    return () => {
      eventBus.off('productAdded', productOnCart);
    };
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
