import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/admin/Dashboard';
import NewProduct from './components/admin/NewProduct';
import OrderList from './components/admin/OrderList';
import ProcessOrder from './components/admin/ProcessOrder';
import ProductList from './components/admin/ProductList';
import ProductReviews from './components/admin/ProductReviews';
import UpdateProduct from './components/admin/UpdateProduct';
import UpdateUser from './components/admin/UpdateUser';
import UserList from './components/admin/UserList';
import Cart from './components/cart/Cart';
import ConfirmOrder from './components/cart/ConfirmOrder';
import OrderSuccess from './components/cart/OrderSuccess';
import Payment from './components/cart/Payment';
import Shipping from './components/cart/Shipping';
import Home from './components/home/Home';
import Footer from './components/layout/footer/Footer';
import Header from './components/layout/header/Header';
import MyOrders from './components/order/MyOrders';
import OrderDetails from './components/order/OrderDetails';
import ProductDetails from './components/product/ProductDetails';
import Products from './components/product/Products';
import Search from './components/product/Search';
import Auth from './components/user/Auth';
import ForgotPassword from './components/user/ForgotPassword';
import Profile from './components/user/Profile';
import ResetPassword from './components/user/ResetPassword';
import UpdatePassword from './components/user/UpdatePassword';
import UpdateProfile from './components/user/UpdateProfile';
import { loadUser } from './redux/actions/userAction';
import store from './redux/store/store';

function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const [stripeApiKey, setStripeApiKey] = useState('');

  async function getStripeApiKey() {
    const { data } = await axios.get('http://localhost:4000/api/v1/stripeapikey', { withCredentials: true });

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  function RequireAuth({ isAdmin, children, redirectTo }) {
    if (!isAuthenticated) {
      return <Navigate to={redirectTo} />;
    }
    if (isAdmin === true && user.role !== 'admin') {
      return <Navigate to={redirectTo} />;
    }
    return children;
    // return isAuthenticated === true ? children : <Navigate to={redirectTo} />;
    // return isAdmin === true && user.role !== 'admin' ? children : <Navigate to={redirectTo} />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:keyword' element={<Products />} />
        <Route path='/search' element={<Search />} />
        <Route path='/login' element={<Auth />} />
        <Route
          path='/account'
          element={
            <RequireAuth redirectTo='/login'>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path='/me/update'
          element={
            <RequireAuth redirectTo='/login'>
              <UpdateProfile />
            </RequireAuth>
          }
        />
        <Route
          path='/password/update'
          element={
            <RequireAuth redirectTo='/login'>
              <UpdatePassword />
            </RequireAuth>
          }
        />
        <Route path='password/forgot' element={<ForgotPassword />} />
        <Route path='password/reset/:token' element={<ResetPassword />} />
        <Route path='cart' element={<Cart />} />
        <Route
          path='/login/shipping'
          element={
            <RequireAuth redirectTo='/login'>
              <Shipping />
            </RequireAuth>
          }
        />
        <Route
          path='/order/confirm'
          element={
            <RequireAuth redirectTo='/login'>
              <ConfirmOrder />
            </RequireAuth>
          }
        />
        <Route
          path='/process/payment'
          element={
            <RequireAuth redirectTo='/login'>
              {stripeApiKey && (
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Payment />
                </Elements>
              )}
            </RequireAuth>
          }
        />
        <Route
          path='/success'
          element={
            <RequireAuth redirectTo='/login'>
              <OrderSuccess />
            </RequireAuth>
          }
        />
        <Route
          path='/orders'
          element={
            <RequireAuth redirectTo='/login'>
              <MyOrders />
            </RequireAuth>
          }
        />
        <Route
          path='/order/:id'
          element={
            <RequireAuth redirectTo='/login'>
              <OrderDetails />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/dashboard'
          element={
            <RequireAuth isAdmin={true} redirectTo='/login'>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/products'
          element={
            <RequireAuth isAdmin={true} redirectTo='/login'>
              <ProductList />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/product/new'
          element={
            <RequireAuth isAdmin={true} redirectTo='/login'>
              <NewProduct />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/product/:id'
          element={
            <RequireAuth isAdmin={true} redirectTo='/login'>
              <UpdateProduct />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/orders'
          element={
            <RequireAuth isAdmin={true} redirectTo='/login'>
              <OrderList />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/order/:id'
          element={
            <RequireAuth isAdmin={true} redirectTo='/login'>
              <ProcessOrder />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/users'
          element={
            <RequireAuth isAdmin={true} redirectTo='/login'>
              <UserList />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/user/:id'
          element={
            <RequireAuth isAdmin={true} redirectTo='/login'>
              <UpdateUser />
            </RequireAuth>
          }
        />
        <Route
          path='/admin/reviews'
          element={
            <RequireAuth isAdmin={true} redirectTo='/login'>
              <ProductReviews />
            </RequireAuth>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
