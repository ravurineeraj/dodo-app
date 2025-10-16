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
  const [allRestaurants, setAllRestaurants] = useState([]);

  const name = userEmail ? userEmail.split('@')[0] : '';
  const capitalize = (s) =>
    s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  useEffect(() => {
    let registeredRestaurants = [];
    try {
      registeredRestaurants =
        JSON.parse(localStorage.getItem('restaurants')) || [];
    } catch (error) {
      console.error('Failed to parse restaurants from localStorage:', error);
    }

    const combinedRestaurants = [...staticRestaurants, ...registeredRestaurants];
    setAllRestaurants(combinedRestaurants);
  }, []);

  // 🔍 Grouped restaurants by category + search filter for "All Categories"
  const groupedRestaurants = useMemo(() => {
    if (selectedCategory !== 'All') return {};

    const grouped = {};

    allRestaurants.forEach((restaurant) => {
      const nameMatch = restaurant.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const menuMatch = restaurant.menu?.some((item) =>
        item?.name?.toLowerCase().includes(search.toLowerCase())
      );

      if (!nameMatch && !menuMatch) return;

      const category = restaurant.category?.trim() || 'Other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(restaurant);
    });

    return grouped;
  }, [allRestaurants, selectedCategory, search]);

  // 🎯 Filtered restaurants when a specific category is selected
  const filteredRestaurants = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'All') return [];

    return allRestaurants
      .filter((r) => r.category === selectedCategory)
      .filter((r) => {
        const nameMatch = r.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const menuMatch = r.menu?.some((item) =>
          item?.name?.toLowerCase().includes(search.toLowerCase())
        );
        return nameMatch || menuMatch;
      });
  }, [allRestaurants, search, selectedCategory]);

  return (
    <main className="body">
      {/* 🔝 Category Buttons */}
      <div
        className="category-buttons"
        role="tablist"
        aria-label="Restaurant Categories"
      >
        <button
          onClick={() => {
            setSelectedCategory('');
            setSearch('');
          }}
          className={selectedCategory === '' ? 'active' : ''}
          role="tab"
          aria-selected={selectedCategory === ''}
        >
          No Category
        </button>
        <button
          onClick={() => {
            setSelectedCategory('All');
            setSearch('');
          }}
          className={selectedCategory === 'All' ? 'active' : ''}
          role="tab"
          aria-selected={selectedCategory === 'All'}
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
              className={selectedCategory === cat ? 'active' : ''}
              aria-selected={selectedCategory === cat}
              role="tab"
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* 👋 Greeting */}
      <div>
        {name ? <h1>Hello {capitalize(name)}!</h1> : <h1>Welcome!</h1>}
      </div>

      <ChatBot />

      {/* 📢 Banner Slider for "No Category" */}
      {selectedCategory === '' && (
        <>
          <h1>Shops Near You</h1>
          <BannerSlider />
        </>
      )}

      {/* 📌 Message for No Category */}
      {selectedCategory === '' && (
        <div className="no-category" role="alert" aria-live="polite">
          <p>Please select a category to view items.</p>
        </div>
      )}

      {/* 📌 Grouped View for "All Categories" */}
      {selectedCategory === 'All' &&
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

      {/* ❗ No Matches in "All Categories" */}
      {selectedCategory === 'All' &&
        Object.keys(groupedRestaurants).length === 0 && (
          <div className="no-restaurants" role="alert" aria-live="polite">
            <p>No results found across all categories for "{search}".</p>
          </div>
        )}

      {/* 🔍 Filtered View for a Specific Category */}
      {selectedCategory &&
        selectedCategory !== 'All' &&
        filteredRestaurants.length === 0 && (
          <div className="no-restaurants" role="alert" aria-live="polite">
            <p>
              No items found in "{selectedCategory}"
              {search && ` matching "${search}"`}.
            </p>
          </div>
        )}

      {selectedCategory &&
        selectedCategory !== 'All' &&
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
