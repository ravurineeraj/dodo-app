import React from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


export default function MenuItem({ item, addToCart }) {
  const handleAdd = () => {
    addToCart(item);

    toast.success(
      <>
        ✅ <strong>{item.name}</strong> from <em>{item.restaurantName}</em> added to cart.{' '}
        <Link to="/cart" style={{ color: '#fff', textDecoration: 'underline' }}>
          Go to Cart
        </Link>
      </>
    );
  };

  return (
    <div className="menu-item">
      <img src={item.image} alt={item.name} className="menu-item-image" />
      <h4>{item.name}</h4>

        <p>
        {item.offerPrice ? (
        <>
        <span className="discounted-price">₹{item.offerPrice}</span>
        <span className="original-price">₹{item.price}</span>
       <span className="you-save">You save ₹{item.price - item.offerPrice}</span>
       </>
      ) : (
      <span>₹{item.price}</span>
        )}
     </p>


      <button onClick={handleAdd}>Add to Cart</button>
    </div>
  );
}
