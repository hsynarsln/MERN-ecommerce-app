import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/home/Home';
import Footer from './components/layout/footer/Footer';
import Header from './components/layout/header/Header';
import ProductDetails from './components/product/ProductDetails';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/product/:id' element={<ProductDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
