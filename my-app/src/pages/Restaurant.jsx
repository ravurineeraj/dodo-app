import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import staticRestaurants from '../data/restaurants';
import MenuItem from '../components/MenuItem';

export default function Restaurant({ addToCart, cartItems, search }) {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const registered = JSON.parse(localStorage.getItem('restaurants')) || [];
    const allRestaurants = [...staticRestaurants, ...registered];
    const found = allRestaurants.find(r => r.id === parseInt(id));
    setRestaurant(found);
  }, [id]);

  if (!restaurant) return <p className="not-found">Restaurant not found</p>;

  const itemsInCart = cartItems.length > 0;

  // 🔍 Filter menu items by search keyword (case-insensitive)
  const filteredMenu = restaurant.menu.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="restaurant-container">
      <div className="restaurant-header">
        <h2>{restaurant.name}</h2>
        <p>{restaurant.cuisine}</p>
      </div>

      <div className="menu-container">
        {filteredMenu.length > 0 ? (
          filteredMenu.map(item => (
            <MenuItem
              key={item.id}
              item={{ ...item, restaurantName: restaurant.name }}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p className="empty-menu">No matching menu items found.</p>
        )}
      </div>

      {itemsInCart && (
        <div className="cart-link-container">
          <Link className="cart-link" to="/cart">
            🛒 Go to Cart ({cartItems.length})
          </Link>
        </div>
      )}
    </div>
  );
}
