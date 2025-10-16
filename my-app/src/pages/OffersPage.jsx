import React, { useEffect, useMemo, useState } from 'react';
import staticRestaurants from '../data/restaurants';
import OfferItemCard from '../components/OfferItemCard';
import { useNavigate } from 'react-router-dom';

export default function OffersPage({
  search,
  selectedCategory,
  setSearch,
  setSelectedCategory,
  addToCart
}) {
  const [allStores, setAllStores] = useState([]);
  const navigate = useNavigate();

  const goToCart = () => {
    navigate('/cart');
  };

  // Load stores on mount
  useEffect(() => {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('restaurants')) || [];
    } catch (err) {
      console.error('Error loading restaurants:', err);
    }
    const combined = [...staticRestaurants, ...saved];
    setAllStores(combined);
  }, []);

  // 🔍 Utility: filter menu items with offers and optional search
  const getFilteredItems = (menu = [], search = '') => {
    const normalizedSearch = search.toLowerCase();
    return menu.filter(item => {
      const hasOffer = item.offerPrice != null && item.offerPrice !== '';
      const matchesSearch = typeof item.name === 'string' &&
        item.name.toLowerCase().includes(normalizedSearch);
      return hasOffer && (!search || matchesSearch);
    });
  };

  // 📦 Grouped items when "All Categories" is selected
  const groupedOfferedItems = useMemo(() => {
    if (selectedCategory !== 'All') return {};

    const grouped = {};

    allStores.forEach(store => {
      const offered = getFilteredItems(store.menu, search);

      if (!offered.length) return;

      const category = typeof store.category === 'string' ? store.category.trim() : 'Other';
      if (!grouped[category]) grouped[category] = [];

      offered.forEach(item => {
        grouped[category].push({
          ...item,
          restaurantName: store.name,
        });
      });
    });

    return grouped;
  }, [allStores, selectedCategory, search]);

  // 📂 Flat list of items for a specific category
  const filteredOfferedItems = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'All') return [];

    return allStores.flatMap(store => {
      if (store.category !== selectedCategory) return [];

      const filtered = getFilteredItems(store.menu, search);

      return filtered.map(item => ({
        ...item,
        restaurantName: store.name,
      }));
    });
  }, [allStores, selectedCategory, search]);

  return (
    <main className="body">

      {/* 🏷️ Category Buttons */}
      <div className="category-buttons" role="tablist" aria-label="Categories">
        <button
          onClick={() => { setSelectedCategory(''); setSearch(''); }}
          className={selectedCategory === '' ? 'active' : ''}
          role="tab"
          aria-selected={selectedCategory === ''}
        >
          No Category
        </button>
        <button
          onClick={() => { setSelectedCategory('All'); setSearch(''); }}
          className={selectedCategory === 'All' ? 'active' : ''}
          role="tab"
          aria-selected={selectedCategory === 'All'}
        >
          All Categories
        </button>
        {['Restaurants', 'Groceries', 'Electronics', 'Dairy Products'].map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setSearch(''); }}
            className={selectedCategory === cat ? 'active' : ''}
            role="tab"
            aria-selected={selectedCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 All Categories Grouped View */}
      {selectedCategory === 'All' && (
        <>
          <h1>🔥 All Offers</h1>
          {Object.entries(groupedOfferedItems).map(([category, items]) => (
            <div key={category} className="category-group">
              <h2>{category}</h2>
              <div className="grid">
                {items.map(item => (
                  <OfferItemCard
                    key={item.id + item.restaurantName}
                    item={item}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedOfferedItems).length === 0 && (
            <p>No offers match your search.</p>
          )}

          <div className="cart-button-wrapper">
            <button onClick={goToCart} className="center-cart-button">
              🛒 Go to Cart
            </button>
          </div>
        </>
      )}

      {/* 📂 Specific Category View */}
      {selectedCategory && selectedCategory !== 'All' && (
        <>
          <h1>🔥 Offers in {selectedCategory}</h1>
          <div className="grid">
            {filteredOfferedItems.length > 0 ? (
              filteredOfferedItems.map(item => (
                <OfferItemCard
                  key={item.id + item.restaurantName}
                  item={item}
                  addToCart={addToCart}
                />
              ))
            ) : (
              <p>No offers in this category match your search.</p>
            )}
          </div>
          <div className="cart-button-wrapper">
            <button onClick={goToCart} className="center-cart-button">
              🛒 Go to Cart
            </button>
          </div>
        </>
      )}

      {/* ⚠️ No Category Selected */}
      {selectedCategory === '' && (
        <div className="no-category">
          <p>Please select a category to view offers.</p>
        </div>
      )}
    </main>
  );
}
