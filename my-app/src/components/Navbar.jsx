import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';

export default function Navbar({ search, setSearch, selectedCategory }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <h2>Swiggy Clone</h2>

          {/* ✅ Changed button to Link */}
          <Link to="/offers" className="supersaver">
            <img
              src="https://th.bing.com/th?q=Mr.+Beast+Logo&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247"
              alt="Logo"
              className="logo"
            />
          </Link>
        </div>
      </div>

      {/* 🔍 Search Bar (only when a category is selected) */}
      {selectedCategory && (
        <div className="navbar-search">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search in ${selectedCategory.toLowerCase()}...`}
            className="search-bar"
            aria-label="Search"
          />
        </div>
      )}

      <ul className="navbar-links">
        <li><Link className="nav-link" to="/">Home</Link></li>
        <li><Link className="nav-link" to="/cart">Cart</Link></li>
        <li><Link className="nav-link" to="/register-restaurant">Add Restaurant</Link></li>
        <li><Link className="nav-link" to="/manage">Manage Restaurants</Link></li>
        <li><Link className="nav-link" to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}
