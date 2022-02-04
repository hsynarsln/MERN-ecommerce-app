import { Slider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearErrors, getProduct } from '../../redux/actions/productAction';
import ProductCard from '../home/ProductCard';
import Loader from '../layout/loader/Loader';
import MetaData from '../layout/Metadata';
import './Products.css';

const categories = ['Laptop', 'Footwear', 'Bottom', 'Tops', 'Attire', 'Camera', 'SmartPhones'];

const Products = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const [currentPage, setCurrentPage] = useState(1);
  const { products, loading, error, productsCount, resultPerPage } = useSelector(state => state.products);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState('');
  const [ratings, setRatings] = useState(0);

  const setCurrentPageNo = e => {
    // console.log(e);
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title='PRODUCTS -- ECOMMERCE' />
          <h2 className='productsHeading'>Products</h2>

          <div className='products'>{products && products.map(product => <ProductCard key={product._id} product={product} />)}</div>

          <div className='filterBox'>
            <Typography>Price</Typography>
            <Slider value={price} onChange={priceHandler} valueLabelDisplay='auto' aria-labelledby='range-slider' min={0} max={25000} />

            <Typography>Categories</Typography>
            <ul className='categoryBox'>
              {categories.map(category => (
                <li className='category-link' key={category} onClick={() => setCategory(category)}>
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component='legend'>Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby='continuous-slider'
                valueLabelDisplay='auto'
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {resultPerPage < productsCount && (
            <div className='paginationBox'>
              <Pagination activePage={currentPage} itemsCountPerPage={resultPerPage} totalItemsCount={productsCount} onChange={setCurrentPageNo} nextPageText='Next' prevPageText='Prev' firstPageText='1st' lastPageText='Last' itemClass='page-item' linkClass='page-link' activeClass='pageItemActive' activeLinkClass='pageLinkActive' />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
