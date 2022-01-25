import { combineReducers } from 'redux';
import { productDetailsReducer, productReducer } from './productReducer';
import { profileReducer, userReducer } from './userReducer';

const rootReducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer
});

export default rootReducer;
