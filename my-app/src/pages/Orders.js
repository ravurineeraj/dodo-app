import React from 'react';

export default function Orders({ previousOrders }) {
  return (
    <div className="orders-container">
      <h2>Previous Orders</h2>

      {previousOrders.length === 0 ? (
        <p className="empty-orders-msg">You have no previous orders.</p>
      ) : (
        <ul className="orders-list">
          {previousOrders.map((item, index) => (
            <li key={index} className="order-item">
              <img
                src={item.image}
                alt={item.name}
                className="order-item-image"
              />

              <div className="order-item-details">
                <span className="order-item-name">{item.name}</span>

                <div className="order-price-section">
                  {item.offerPrice ? (
                    <>
                      <span className="order-discounted-price">₹{item.offerPrice}</span>{' '}
                      <span className="order-original-price">₹{item.price}</span>
                      <span className="order-saved">You saved ₹{item.price - item.offerPrice}</span>
                    </>
                  ) : (
                    <span className="order-regular-price">₹{item.price}</span>
                  )}
                </div>

                <span className="order-restaurant-name">from {item.restaurantName}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
