import { Rating } from '@material-ui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import Carousel from 'react-material-ui-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addItemsToCart } from '../../redux/actions/cartActions';
import { clearErrors, getProductDetails, newReview } from '../../redux/actions/productAction';
import { NEW_REVIEW_RESET } from '../../redux/constants/productConstants';
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
  const { success, error: reviewError } = useSelector(state => state.newReview);
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

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set('rating', rating);
    myForm.set('comment', comment);
    myForm.set('productId', id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success('Review Submitted Successfully');
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert, reviewError, success]);

  return (
    <>
      {loading || !product ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className='ProductDetails'>
            <div className='CarouselContainer'>
              <Carousel
                fullHeightHover={true} // We want the nav buttons wrapper to only be as big as the button element is
                navButtonsProps={{
                  // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
                  style: {
                    backgroundColor: '#090b13',
                    color: '#fff',
                    width: '20px',
                    padding: '0px 20px',
                    borderRadius: '50%'
                  }
                }}
                navButtonsWrapperProps={{
                  // Move the buttons to the bottom. Unsetting top here to override default style.
                  style: {
                    bottom: '0',
                    top: 'unset'
                  }
                }}
              >
                {product.images && product.images.map((item, i) => <img className='CarouselImage' key={i} src={item.url} alt={`${i} Slide`} />)}
              </Carousel>
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

              <button onClick={submitReviewToggle} className='submitReview'>
                Submit Review
              </button>
            </div>
          </div>

          <h3 className='reviewsHeading'>REVIEWS</h3>

          <Dialog aria-labelledby='simple-dialog-title' open={open} onClose={submitReviewToggle}>
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className='submitDialog'>
              <Rating onChange={e => setRating(e.target.value)} value={rating} size='large' />

              <textarea className='submitDialogTextArea' cols='30' rows='5' value={comment} onChange={e => setComment(e.target.value)}></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color='secondary'>
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color='primary'>
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
