import React from 'react';

export default function OfferItemCard({ item, addToCart }) {
  const handleAddToCart = (e) => {
    e.stopPropagation(); // 🛑 Prevent bubbling if wrapped in clickable cards
    e.preventDefault();  // ✅ Avoid form submission or reload

    if (addToCart) {
      addToCart(item);
    }
  };

  return (
    <div className="offer-item-card">
      <img
        src={item.image}
        alt={item.name}
        className="offer-image"
        onError={(e) => (e.target.src = '/placeholder.jpg')}
      />
      <div className="offer-details">
        <h3>{item.name}</h3>
        <p className="restaurant-name">From: {item.restaurantName}</p>
        <p>
          <del>₹{item.price}</del>{' '}
          <strong className="offer-price">₹{item.offerPrice}</strong>
        </p>
        <button className="add-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
