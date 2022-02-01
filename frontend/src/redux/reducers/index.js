import { combineReducers } from 'redux';
import { cartReducer } from './cartReducer';
import { myOrdersReducer, newOrderReducer, orderDetailReducer } from './orderReducer';
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productsReducer } from './productReducer';
import { forgotPasswordReducer, profileReducer, userReducer } from './userReducer';

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
  product: productReducer
});

export default rootReducer;
