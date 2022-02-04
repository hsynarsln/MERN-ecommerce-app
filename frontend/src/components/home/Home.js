import MouseIcon from '@mui/icons-material/Mouse';
import React, { Fragment, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProduct } from '../../redux/actions/productAction';
import Loader from '../layout/loader/Loader';
import MetaData from '../layout/Metadata';
import './Home.css';
import ProductCard from './ProductCard';

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector(state => state.products);
  // console.log(products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title='ECOMMERCE' />
          <div className='banner'>
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href='#container'>
              <button>
                <MouseIcon />
              </button>
            </a>
          </div>

          <h2 className='homeHeading'>Featured Products</h2>

          <div className='container' id='container'>
            {products && products.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        </Fragment>
      )}
    </>
  );
};

export default Home;
