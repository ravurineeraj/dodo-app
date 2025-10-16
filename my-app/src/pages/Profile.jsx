import React, { useState } from 'react';
import Orders from './Orders'; // Import Orders component

function Profile({ previousOrders, onLogout }) {
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      
      <nav className="profile-tabs">
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={activeTab === 'vouchers' ? 'active' : ''}
          onClick={() => setActiveTab('vouchers')}
        >
          Vouchers
        </button>
        <button
          className={activeTab === 'addresses' ? 'active' : ''}
          onClick={() => setActiveTab('addresses')}
        >
          Saved Addresses
        </button>
        <button
          className={activeTab === 'payments' ? 'active' : ''}
          onClick={() => setActiveTab('payments')}
        >
          Payments
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          onClick={onLogout}
          className={activeTab === 'logout' ? 'active' : ''}
        >
          Logout
        </button>
      </nav>

      <section className="profile-content">
        {activeTab === 'settings' && (
          <div>
            <h2>Settings</h2>
            {/* Your settings form/components here */}
            <p>Update your profile info, change password, etc.</p>
          </div>
        )}

        {activeTab === 'vouchers' && (
          <div>
            <h2>Vouchers</h2>
            {/* List of vouchers */}
            <p>You have no vouchers yet.</p>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div>
            <h2>Saved Addresses</h2>
            {/* List of saved addresses */}
            <p>No saved addresses.</p>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h2>Payments</h2>
            {/* Payment methods */}
            <p>No payment methods saved.</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <Orders previousOrders={previousOrders} />
        )}
      </section>
    </div>
  );
}

export default Profile;
