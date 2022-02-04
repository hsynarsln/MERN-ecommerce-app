import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailReducer, orderReducer } from './orderReducer';
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productReviewsReducer, productsReducer, reviewReducer } from './productReducer';
import { allUserReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from './userReducer';

const rootReducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducer,
  product: productReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  allUser: allUserReducer,
  userDetails: userDetailsReducer,
  productReviews: productReviewsReducer,
  review: reviewReducer
});

export default rootReducer;
