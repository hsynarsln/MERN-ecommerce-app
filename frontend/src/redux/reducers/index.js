import { combineReducers } from 'redux';
import { productDetailsReducer, productReducer } from './productReducer';
import { userReducer } from './userReducer';

const rootReducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer
});

export default rootReducer;
