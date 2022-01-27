import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home/Home';
import Footer from './components/layout/footer/Footer';
import Header from './components/layout/header/Header';
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
  const { loading, isAuthenticated, user } = useSelector(state => state.user);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  function RequireAuth({ children, redirectTo }) {
    return isAuthenticated ? children : <Navigate to={redirectTo} />;
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
