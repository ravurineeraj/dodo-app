import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import restaurants from './data/restaurants';

// Lazy-loaded components
const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
const Home = lazy(() => import('./pages/Home'));
const Restaurant = lazy(() => import('./pages/Restaurant'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Login = lazy(() => import('./pages/Login'));
const RegisterRestaurant = lazy(() => import('./pages/RegisterRestaurant'));
const Profile = lazy(() => import('./pages/Profile'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ManageRestaurants = lazy(() => import('./components/ManageRestaurants'));
const OffersPage = lazy(() => import('./pages/OffersPage'));

// 🔐 Protected Route Component
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const navigate = useNavigate();

  // 🔐 Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🛒 Cart & Orders
  const [cartItems, setCartItems] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);

  // 🔍 Search and category filter
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // 📧 Logged-in user email
  const [userEmail, setUserEmail] = useState('');

  // ✅ Load state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedEmail = localStorage.getItem('userEmail');
    const storedOrders = localStorage.getItem('orders');
    const storedCart = localStorage.getItem('cart');

    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      if (storedEmail) setUserEmail(storedEmail);
    }

    if (storedOrders) setPreviousOrders(JSON.parse(storedOrders));
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  // 💾 Persist orders & cart
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(previousOrders));
  }, [previousOrders]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 🔐 Login / Logout
  const handleLogin = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    toast.success('Login successful!');
    navigate('/');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('orders');
    localStorage.removeItem('cart');
    toast.info('Logged out');
    navigate('/login');
  };

  // 🛒 Cart management
  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handlePayment = () => {
    if (cartItems.length > 0) {
      setPreviousOrders((prev) => [...prev, ...cartItems]);
      clearCart();
      toast.success('Payment successful! Thank you for your order.');
    }
  };

  return (
    <div className="app">
      <Suspense fallback={<div>Loading...</div>}>
        {isAuthenticated && (
          <Navbar
            search={search}
            setSearch={setSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        <main className="content">
          <Routes>
            {/* 👤 Login */}
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
              }
            />

            {/* 🆕 SignUp */}
            <Route
              path="/signup"
              element={
                isAuthenticated ? <Navigate to="/" /> : <SignUp />
              }
            />

            {/* 🏠 Home */}
            <Route
              path="/"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Home
                    userEmail={userEmail}
                    search={search}
                    setSearch={setSearch}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                </PrivateRoute>
              }
            />

            {/* 🍽 Restaurant */}
            <Route
              path="/restaurant/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Restaurant addToCart={handleAddToCart} cartItems={cartItems} search={search} />
                </PrivateRoute>
              }
            />

            {/* 🛒 Cart / Checkout */}
            <Route
              path="/cart"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Checkout
                    cartItems={cartItems}
                    clearCart={clearCart}
                    onPayment={handlePayment}
                    removeItem={(index) => {
                      const updatedCart = [...cartItems];
                      updatedCart.splice(index, 1);
                      setCartItems(updatedCart);
                    }}
                  />
                </PrivateRoute>
              }
            />

            {/* 📦 Orders */}
            <Route
              path="/orders"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Orders previousOrders={previousOrders} />
                </PrivateRoute>
              }
            />

            {/* 👤 Profile */}
            <Route
              path="/profile"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Profile previousOrders={previousOrders} onLogout={handleLogout} />
                </PrivateRoute>
              }
            />

            {/* 🛠 Manage Restaurants */}
            <Route
              path="/manage"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ManageRestaurants />
                </PrivateRoute>
              }
            />

            {/* 🍴 Register Restaurant (now protected) */}
            <Route
              path="/register-restaurant"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <RegisterRestaurant />
                </PrivateRoute>
              }
            />

            {/* 💰 Offers */}
            <Route
              path="/offers"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <OffersPage
                    data={restaurants}
                    selectedCategory={selectedCategory}
                    setSearch={setSearch}
                    search={search}
                    setSelectedCategory={setSelectedCategory}
                    addToCart={handleAddToCart}
                  />
                </PrivateRoute>
              }
            />

            {/* 🧭 Fallback */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? '/' : '/login'} />}
            />
          </Routes>
        </main>

        {isAuthenticated && <Footer />}
        <ToastContainer position="top-right" autoClose={2500} />
      </Suspense>
    </div>
  );
}

export default App;
