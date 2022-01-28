import { Rating } from '@material-ui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import Carousel from 'react-material-ui-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addItemsToCart } from '../../redux/actions/cartActions';
import { clearErrors, getProductDetails } from '../../redux/actions/productAction';
import Loader from '../layout/loader/Loader';
import MetaData from '../layout/Metadata';
import './ProductDetails.css';
import ReviewCard from './ReviewCard';

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  // console.log(id);
  const alert = useAlert();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { product, loading, error } = useSelector(state => state.productDetails);
  // console.log(product);
  const options = {
    size: 'large',
    value: product?.ratings,
    readOnly: true,
    precision: 0.5
  };

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success('Item added to cart');
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert]);

  return (
    <>
      {loading || !product ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className='ProductDetails'>
            <div>
              <Carousel>{product.images && product.images.map((item, i) => <img className='CarouselImage' key={i} src={item.url} alt={`${i} Slide`} />)}</Carousel>
            </div>

            <div>
              <div className='detailsBlock-1'>
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className='detailsBlock-2'>
                <Rating {...options} />
                <span className='detailsBlock-2-span'> ({product.numOfReviews} Reviews)</span>
              </div>
              <div className='detailsBlock-3'>
                <h1>{`$${product.price}`}</h1>
                <div className='detailsBlock-3-1'>
                  <div className='detailsBlock-3-1-1'>
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type='number' value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button disabled={product.Stock < 1 ? true : false} onClick={addToCartHandler}>
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.Stock < 1 ? 'redColor' : 'greenColor'}>{product.Stock < 1 ? 'OutOfStock' : 'InStock'}</b>
                </p>
              </div>

              <div className='detailsBlock-4'>
                Description : <p>{product.description}</p>
              </div>

              <button onClick={() => {}} className='submitReview'>
                Submit Review
              </button>
            </div>
          </div>

          <h3 className='reviewsHeading'>REVIEWS</h3>

          <Dialog aria-labelledby='simple-dialog-title' open={open} onClose={() => {}}>
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className='submitDialog'>
              <Rating onChange={e => setRating(e.target.value)} value={rating} size='large' />

              <textarea className='submitDialogTextArea' cols='30' rows='5' value={comment} onChange={e => setComment(e.target.value)}></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {}} color='secondary'>
                Cancel
              </Button>
              <Button onClick={() => {}} color='primary'>
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? <div className='reviews'>{product.reviews && product.reviews.map(review => <ReviewCard key={review._id} review={review} />)}</div> : <p className='noReviews'>No Reviews Yet</p>}
        </>
      )}
    </>
  );
};

export default ProductDetails;
