import { combineReducers } from 'redux';
import { productDetailsReducer, productReducer } from './productReducer';
import { forgotPasswordReducer, profileReducer, userReducer } from './userReducer';

const rootReducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer
});

export default rootReducer;
