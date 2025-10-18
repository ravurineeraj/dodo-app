import React from 'react';
import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  const isFar = restaurant.isFar;

  return (
    <div className="card">
      <img src={restaurant.image} alt={restaurant.name} />
      <h3>{restaurant.name}</h3>
      <p>{restaurant.cuisine}</p>

      {isFar && (
        <div
          className="far-badge"
          style={{ color: 'red', fontWeight: 'bold', marginBottom: '8px' }}
          role="alert"
          aria-live="polite"
        >
          This restaurant is far from your location
        </div>
      )}

      {isFar ? (
        <button className="btna disabled" disabled aria-disabled="true" title="Too far to order">
          View Menu
        </button>
      ) : (
        <Link to={`/restaurant/${restaurant.id}`} className="btna">
          View Menu
        </Link>
      )}
    </div>
  );
}
