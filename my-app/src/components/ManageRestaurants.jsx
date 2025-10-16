import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const categoryOptions = [
  { value: 'Restaurants', label: 'Restaurants' },
  { value: 'Groceries', label: 'Groceries' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Dairy Products', label: 'Dairy Products' },
];

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cuisine: '',
    address: '',
    image: '',
    deliveryTime: '',
    price: '',
    menu: [],
  });

  const [menuItem, setMenuItem] = useState({
    name: '',
    price: '',
    offerPrice: '',
    image: '',
  });

  const [editingMenuId, setEditingMenuId] = useState(null); // <-- NEW

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('restaurants')) || [];
    setRestaurants(stored);
  }, []);

  const handleDelete = (index) => {
    const updated = [...restaurants];
    updated.splice(index, 1);
    setRestaurants(updated);
    localStorage.setItem('restaurants', JSON.stringify(updated));
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setFormData(restaurants[index]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      category: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleMenuChange = (e) => {
    const { name, value } = e.target;
    setMenuItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addOrUpdateMenuItem = () => {
    if (!menuItem.name || !menuItem.price) {
      alert('Please enter menu item name and price');
      return;
    }

    if (editingMenuId !== null) {
      // Update existing item
      setFormData((prev) => ({
        ...prev,
        menu: prev.menu.map((item) =>
          item.id === editingMenuId
            ? {
                ...item,
                ...menuItem,
                price: Number(menuItem.price),
                offerPrice: menuItem.offerPrice ? Number(menuItem.offerPrice) : null,
              }
            : item
        ),
      }));
      setEditingMenuId(null);
    } else {
      // Add new item
      setFormData((prev) => ({
        ...prev,
        menu: [
          ...prev.menu,
          {
            id: Date.now(),
            ...menuItem,
            price: Number(menuItem.price),
            offerPrice: menuItem.offerPrice ? Number(menuItem.offerPrice) : null,
          },
        ],
      }));
    }

    setMenuItem({ name: '', price: '', offerPrice: '', image: '' });
  };

  const editMenuItem = (item) => {
    setMenuItem({
      name: item.name,
      price: item.price,
      offerPrice: item.offerPrice || '',
      image: item.image || '',
    });
    setEditingMenuId(item.id);
  };

  const removeMenuItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      menu: prev.menu.filter((item) => item.id !== id),
    }));
    if (editingMenuId === id) {
      setMenuItem({ name: '', price: '', offerPrice: '', image: '' });
      setEditingMenuId(null);
    }
  };

  const handleUpdate = () => {
    const updated = [...restaurants];
    updated[editingIndex] = formData;
    setRestaurants(updated);
    localStorage.setItem('restaurants', JSON.stringify(updated));
    setEditingIndex(null);
    setFormData({
      name: '',
      category: '',
      cuisine: '',
      address: '',
      image: '',
      deliveryTime: '',
      price: '',
      menu: [],
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setFormData({
      name: '',
      category: '',
      cuisine: '',
      address: '',
      image: '',
      deliveryTime: '',
      price: '',
      menu: [],
    });
    setMenuItem({ name: '', price: '', offerPrice: '', image: '' });
    setEditingMenuId(null);
  };

  return (
    <div className="manage-container">
      <h1>Manage Your Restaurants</h1>

      {restaurants.length === 0 ? (
        <p>No registered restaurants found.</p>
      ) : (
        <ul className="restaurant-list">
          {restaurants.map((r, index) => (
            <li key={index}>
              <strong>{r.name}</strong> - {r.category}
              <div>
                <button onClick={() => startEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingIndex !== null && (
        <div className="edit-form">
          <h2>Edit Restaurant</h2>

          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>

          <label>
            Category:
            <Select
              options={categoryOptions}
              value={categoryOptions.find((opt) => opt.value === formData.category) || null}
              onChange={handleCategoryChange}
              isClearable
              classNamePrefix="react-select"
            />
          </label>

          <label>
            Cuisine:
            <input type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} />
          </label>

          <label>
            Address:
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </label>

          <label>
            Image URL:
            <input type="url" name="image" value={formData.image} onChange={handleChange} />
          </label>

          <label>
            Delivery Time (mins):
            <input type="number" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} />
          </label>

          <label>
            Starting Price:
            <input type="number" name="price" value={formData.price} onChange={handleChange} />
          </label>

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
            <button type="button" onClick={addOrUpdateMenuItem}>
              {editingMenuId !== null ? 'Update Menu Item' : 'Add Menu Item'}
            </button>
          </div>

          <ul className="menu-item-list">
            {formData.menu.map((item) => (
              <li key={item.id}>
                {item.image && <img src={item.image} alt={item.name} className="menu-item-image" />}
                <div className="menu-item-info">
                  <div className="menu-item-text">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">₹{item.price}</span>
                    {item.offerPrice !== null && item.offerPrice !== '' && (
                      <span className="item-offer-price">Offer Price: ₹{item.offerPrice}</span>
                    )}
                  </div>
                  <div>
                    <button type="button" onClick={() => editMenuItem(item)}>Edit</button>
                    <button type="button" onClick={() => removeMenuItem(item.id)}>Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button className="save-btn" onClick={handleUpdate}>
            Save Changes
          </button>
          <button className="cancel-btn" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
