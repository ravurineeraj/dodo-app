import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const categoryOptions = [
  { value: 'Restaurants', label: 'Restaurants' },
  { value: 'Groceries', label: 'Groceries' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Dairy Products', label: 'Dairy Products' }
];

export default function RegisterRestaurant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cuisine: '',
    address: '',
    image: '',
    deliveryTime: '',
    price: '',
    location: '',
    lat: '',
    long: '',
    menu: []
  });

  const [menuItem, setMenuItem] = useState({
    name: '',
    price: '',
    offerPrice: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMenuChange = (e) => {
    const { name, value } = e.target;
    setMenuItem(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      category: selectedOption ? selectedOption.value : ''
    }));
  };

  const addMenuItem = () => {
    if (!menuItem.name || !menuItem.price) {
      alert('Please enter menu item name and price');
      return;
    }

    setFormData(prev => ({
      ...prev,
      menu: [
        ...prev.menu,
        {
          id: Date.now(),
          ...menuItem,
          price: Number(menuItem.price),
          offerPrice: menuItem.offerPrice ? Number(menuItem.offerPrice) : null
        }
      ]
    }));

    setMenuItem({ name: '', price: '', offerPrice: '', image: '' });
  };

  const removeMenuItem = (id) => {
    setFormData(prev => ({
      ...prev,
      menu: prev.menu.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    if (formData.menu.length === 0) {
      alert('Please add at least one menu item');
      return;
    }

    if (!formData.lat || !formData.long) {
      alert('Please provide latitude and longitude for location tracking.');
      return;
    }

    const existingRestaurants = JSON.parse(localStorage.getItem('restaurants')) || [];

    const newRestaurant = {
      id: Date.now(),
      ...formData,
      deliveryTime: Number(formData.deliveryTime),
      price: Number(formData.price),
      lat: parseFloat(formData.lat),
      long: parseFloat(formData.long),
    };

    localStorage.setItem('restaurants', JSON.stringify([...existingRestaurants, newRestaurant]));

    alert('Restaurant registered successfully!');
    navigate('/');
  };

  return (
    <div className="login-container">
      <form className="login-form-reg" onSubmit={handleSubmit}>
        <h2>Register Restaurant</h2>

        <div className="input-group">
          <label htmlFor="name">Restaurant Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Tandoori Treats"
          />
        </div>

        <div className="input-group">
          <label htmlFor="category">Select Category</label>
          <Select
            options={categoryOptions}
            onChange={handleCategoryChange}
            placeholder="Choose a category..."
            isClearable
            classNamePrefix="custom-select"
          />
        </div>

        <div className="input-group">
          <label htmlFor="cuisine">Cuisine</label>
          <input
            type="text"
            name="cuisine"
            required
            value={formData.cuisine}
            onChange={handleChange}
            placeholder="e.g. Indian, Chinese"
          />
        </div>

        <div className="input-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
          />
        </div>

        <div className="input-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            name="image"
            required
            value={formData.image}
            onChange={handleChange}
            placeholder="Link to restaurant image"
          />
        </div>

        <div className="input-group">
          <label htmlFor="deliveryTime">Delivery Time (in mins)</label>
          <input
            type="number"
            name="deliveryTime"
            required
            value={formData.deliveryTime}
            onChange={handleChange}
            placeholder="e.g. 30"
          />
        </div>

        <div className="input-group">
          <label htmlFor="price">Starting Price (₹)</label>
          <input
            type="number"
            name="price"
            required
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 150"
          />
        </div>

        <div className="input-group">
          <label htmlFor="location">Location Name</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Mumbai, Andheri"
          />
        </div>

        <div className="input-group">
          <label htmlFor="lat">Latitude</label>
          <input
            type="number"
            name="lat"
            step="any"
            value={formData.lat}
            onChange={handleChange}
            placeholder="e.g. 19.076"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="long">Longitude</label>
          <input
            type="number"
            name="long"
            step="any"
            value={formData.long}
            onChange={handleChange}
            placeholder="e.g. 72.8777"
            required
          />
        </div>

        {/* Menu Items Section */}
        <h3>Menu Items</h3>

        <div className="menu-item-inputs">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={menuItem.name}
            onChange={handleMenuChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={menuItem.price}
            onChange={handleMenuChange}
          />
          <input
            type="number"
            name="offerPrice"
            placeholder="Offer Price"
            value={menuItem.offerPrice}
            onChange={handleMenuChange}
          />
          <input
            type="url"
            name="image"
            placeholder="Image URL"
            value={menuItem.image}
            onChange={handleMenuChange}
          />
          <button type="button" onClick={addMenuItem}>Add Menu Item</button>
        </div>

        {/* Display menu items */}
        <ul className="menu-item-list">
          {formData.menu.map(item => (
            <li key={item.id} className="menu-item">
              <div className="menu-item-content">
                {item.image && (
                  <img src={item.image} alt={item.name} className="menu-item-image" />
                )}
                <div className="menu-item-info">
                  <div className="menu-item-text">
                    <strong className="item-name">{item.name}</strong>
                    <p className="item-price">₹{item.price}</p>
                    {item.offerPrice !== null && item.offerPrice !== '' && (
                      <p className="item-offer-price">Offer Price: ₹{item.offerPrice}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeMenuItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button type="submit" className="login-button">Register Restaurant</button>
      </form>
    </div>
  );
}
