import React from 'react';

export default function Checkout({ cartItems, clearCart, onPayment, removeItem }) {
  const total = cartItems.reduce((sum, item) => sum + (item.offerPrice || item.price), 0);


  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart-msg">Your cart is empty.</p>
      ) : (
        <>
          <ul className="checkout-list">
            {cartItems.map((item, index) => (
              <li key={index} className="checkout-item">
                <div className="item-image-price">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="checkout-item-image"
                  />
                  <span className="item-price">
                        {item.offerPrice ? (
                       <>
                        <span className="discounted-price">₹{item.offerPrice}</span>{' '}
                        <span className="original-price">₹{item.price}</span>
                       </>
                      ) : (
                           <>₹{item.price}</>
                         )}
                   </span>

                </div>

                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="restaurant-name">from {item.restaurantName}</span>
                </div>

                {/* Remove button */}
                <button
                  className="remove-button"
                  onClick={() => removeItem(index)}
                >
                  🗑 Remove
                </button>
              </li>
            ))}
          </ul>

          <h3 className="checkout-total">Total Amount: ₹{total}</h3>

          <div className="checkout-buttons">
            <button onClick={onPayment}>✅ Pay Now</button>
            <button
              onClick={clearCart}
              style={{ backgroundColor: '#e53935', color: '#fff' }}
            >
              ❌ Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
