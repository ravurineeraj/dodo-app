import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function Navbar({ search, setSearch, selectedCategory }) {
  const [location, setLocation] = useState('Fetching location...');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });

  // 🚀 Get current GPS location and update state/localStorage
  const setCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);

          setLocation('Current Location');
          setCoordinates({ lat, lng });

          localStorage.setItem('userLocation', 'Current Location');
          localStorage.setItem('userLat', lat);
          localStorage.setItem('userLng', lng);
          window.dispatchEvent(new CustomEvent('locationChanged'));

        },
        (err) => {
          console.error('Geolocation error:', err);
          setLocation('Unknown Location');
        }
      );
    } else {
      alert('Geolocation not supported in this browser.');
      setLocation('Unknown Location');
    }
  };

  // 🌍 Try to geocode typed location, fallback on error
  const geocodeLocation = async (locText) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locText
        )}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const lat = data[0].lat;
        const lng = data[0].lon;

        setCoordinates({ lat, lng });
        localStorage.setItem('userLat', lat);
        localStorage.setItem('userLng', lng);
        localStorage.setItem('userLocation', locText);
        setLocation(locText);
        window.dispatchEvent(new CustomEvent('locationChanged'));
      } else {
        throw new Error('Location not found');
      }
    } catch (err) {
      console.error('Geocoding failed:', err);
      alert('Location not found. Using current GPS location instead.');
      setCurrentLocation(); // fallback to GPS
    }
  };

  // ⌨️ On user pressing Enter in location input
  const handleLocationKeyDown = (e) => {
    if (e.key === 'Enter' && location.trim() !== '') {
      geocodeLocation(location.trim());
    }
  };

  // 📦 On first load — get GPS coordinates and set as default
  useEffect(() => {
    // Load initial location from localStorage if exists
    const storedLocation = localStorage.getItem('userLocation');
    const storedLat = localStorage.getItem('userLat');
    const storedLng = localStorage.getItem('userLng');

    if (storedLocation && storedLat && storedLng) {
      setLocation(storedLocation);
      setCoordinates({ lat: storedLat, lng: storedLng });
    } else {
      setCurrentLocation();
    }

    // Listen for localStorage changes (other tabs/windows)
    const onStorageChange = (event) => {
      if (
        event.key === 'userLat' ||
        event.key === 'userLng' ||
        event.key === 'userLocation'
      ) {
        const newLat = localStorage.getItem('userLat');
        const newLng = localStorage.getItem('userLng');
        const newLoc = localStorage.getItem('userLocation');

        if (newLat && newLng && newLoc) {
          setLocation(newLoc);
          setCoordinates({ lat: newLat, lng: newLng });
        }
      }
    };

    window.addEventListener('storage', onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  // 🔍 Memoize dynamic search placeholder
  const searchPlaceholder = useMemo(() => {
    return selectedCategory
      ? `Search in ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}...`
      : 'Search...';
  }, [selectedCategory]);

  return (
    <nav className="navbar" role="navigation">
      <div className="navbar-left">
        <div className="navbar-brand">
          <h2>EMPORIUM</h2>

          <Link to="/offers" className="supersaver">
            <img
              src="https://th.bing.com/th?q=Mr.+Beast+Logo&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247"
              alt="Logo"
              className="logo"
            />
          </Link>
        </div>
      </div>

      {/* 📍 Location Input + Icon */}
      <div className="navbar-location">
        <input
         type="text"
         value={location}
         onChange={(e) => setLocation(e.target.value)}
         onKeyDown={handleLocationKeyDown}
         onClick={() => setLocation('')} // 👈 clears input on click
         placeholder="Enter your location"
         className="location-input"
         aria-label="Location"
        />

        <FaMapMarkerAlt onClick={setCurrentLocation} title="Use current location" />
      </div>

      {/* 🔍 Search Bar */}
      {selectedCategory && (
        <div className="navbar-search">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="search-bar"
            aria-label="Search"
          />
        </div>
      )}

      <ul className="navbar-links">
        <li>
          <Link className="nav-link" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/cart">
            Cart
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/register-restaurant">
            Add Restaurant
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/manage">
            Manage Restaurants
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}
