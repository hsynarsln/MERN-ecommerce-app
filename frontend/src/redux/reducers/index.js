import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import { myOrdersReducer, newOrderReducer, orderDetailReducer } from './orderReducer';
import { newReviewReducer, productDetailsReducer, productReducer } from './productReducer';
import { forgotPasswordReducer, profileReducer, userReducer } from './userReducer';

const rootReducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailReducer,
  newReview: newReviewReducer
});

export default rootReducer;
