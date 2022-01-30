import axios from 'axios';
import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from '../constants/cartConstants';

//! add to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`);
  // console.log(data);

  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.stock,
      quantity
    }
  });
  const { cartItems } = getState().cart;
  // console.log(cartItems);

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

//! REMOVE FROM CART
export const removeItemsFromCart = id => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id
  });

  const { cartItems } = getState().cart;
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

//! SAVE SHIPPING INFO
export const saveShippingInfo = data => async dispatch => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data
  });

  localStorage.setItem('shippingInfo', JSON.stringify(data));
};
