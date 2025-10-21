import React, { useEffect, useMemo, useState } from 'react';
import staticRestaurants from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import BannerSlider from '../components/BannerSlider';
import ChatBot from '../components/ChatBot';

export default function Home({
  userEmail,
  search,
  selectedCategory,
  setSearch,
  setSelectedCategory,
}) {
  const [rawRestaurants, setRawRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const name = userEmail ? userEmail.split('@')[0] : '';
  const capitalize = (s) =>
    s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  const activeCategory = selectedCategory || 'All';

  // 📦 Load static + saved restaurants
  useEffect(() => {
    const registered = JSON.parse(localStorage.getItem('restaurants') || '[]');
    setRawRestaurants([...staticRestaurants, ...registered]);
  }, []);

  // 📍 Load coordinates from localStorage
  useEffect(() => {
    const updateLocation = () => {
      const lat = parseFloat(localStorage.getItem('userLat'));
      const lng = parseFloat(localStorage.getItem('userLng'));
      if (lat && lng) {
        setUserLocation({ lat, lon: lng });
      } else {
        setUserLocation(null);
      }
    };

    updateLocation();

    window.addEventListener('locationChanged', updateLocation);
    window.addEventListener('storage', (e) => {
      if (e.key === 'userLat' || e.key === 'userLng') updateLocation();
    });

    return () => {
      window.removeEventListener('locationChanged', updateLocation);
      window.removeEventListener('storage', updateLocation);
    };
  }, []);

  // 🧭 Distance calc
  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const allRestaurants = useMemo(() => {
    const THRESHOLD_KM = 5;
    return rawRestaurants.map((r) => {
      if (!userLocation || !r.lat || !r.long) return { ...r, isFar: true };
      const distance = getDistanceInKm(userLocation.lat, userLocation.lon, r.lat, r.long);
      return { ...r, isFar: distance > THRESHOLD_KM };
    });
  }, [rawRestaurants, userLocation]);

  // 🍱 Grouped for All Categories
  const groupedRestaurants = useMemo(() => {
    if (activeCategory !== 'All') return {};

    const grouped = {};

    allRestaurants.forEach((r) => {
      const nameMatch = r.name.toLowerCase().includes(search.toLowerCase());
      const menuMatch = r.menu?.some((item) =>
        item?.name?.toLowerCase().includes(search.toLowerCase())
      );
      const matchesSearch = nameMatch || menuMatch;

      if (!search && r.isFar) return;
      if (!matchesSearch) return;

      const category = r.category?.trim() || 'Other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(r);
    });

    return grouped;
  }, [allRestaurants, search, activeCategory]);

  // 🔍 Filtered for a Specific Category
  const filteredRestaurants = useMemo(() => {
    if (activeCategory === 'All') return [];

    return allRestaurants
      .filter((r) => r.category === activeCategory)
      .filter((r) => {
        const nameMatch = r.name.toLowerCase().includes(search.toLowerCase());
        const menuMatch = r.menu?.some((item) =>
          item?.name?.toLowerCase().includes(search.toLowerCase())
        );
        const matchesSearch = nameMatch || menuMatch;
        return search ? matchesSearch : matchesSearch && !r.isFar;
      });
  }, [allRestaurants, search, activeCategory]);

  return (
    <main className="body">
      {/* Categories */}
      <div className="category-buttons" role="tablist">
        <button
          onClick={() => {
            setSelectedCategory('All');
            setSearch('');
          }}
          className={activeCategory === 'All' ? 'active' : ''}
          role="tab"
          aria-selected={activeCategory === 'All'}
        >
          All Categories
        </button>
        {['Restaurants', 'Groceries', 'Electronics', 'Dairy Products'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearch('');
              }}
              className={activeCategory === cat ? 'active' : ''}
              role="tab"
              aria-selected={activeCategory === cat}
            >
              {cat}
            </button>
          )
        )}
      </div>

      <div>
        {name ? <h1>Hello {capitalize(name)}!</h1> : <h1>Welcome!</h1>}
      </div>

      <ChatBot />

      {/* 📢 Show Banner */}
      {activeCategory === 'All' && (
        <>
          <h1>Shops Near You</h1>
          <BannerSlider />
        </>
      )}

      {/* Render All */}
      {activeCategory === 'All' &&
        Object.entries(groupedRestaurants).map(([category, restaurants]) => (
          <div key={category} className="category-group">
            <h2>{category}</h2>
            <div className="grid">
              {restaurants.map((r) => (
                <RestaurantCard key={r.id || r.name} restaurant={r} />
              ))}
            </div>
          </div>
        ))}

      {activeCategory === 'All' &&
        Object.keys(groupedRestaurants).length === 0 && (
          <div className="no-restaurants" role="alert" aria-live="polite">
            <p>No results found across all categories for "{search}".</p>
          </div>
        )}

      {/* Render Filtered */}
      {activeCategory !== 'All' &&
        filteredRestaurants.length === 0 && (
          <div className="no-restaurants" role="alert" aria-live="polite">
            <p>
              No items found in "{activeCategory}"
              {search && ` matching "${search}"`}.
            </p>
          </div>
        )}

      {activeCategory !== 'All' &&
        filteredRestaurants.length > 0 && (
          <div className="grid">
            {filteredRestaurants.map((r) => (
              <RestaurantCard key={r.id || r.name} restaurant={r} />
            ))}
          </div>
        )}
    </main>
  );
}
