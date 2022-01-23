import { ALL_PRODUCT_FAIL, ALL_PRODUCT_REQUEST, ALL_PRODUCT_SUCCESS, CLEAR_ERRORS, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS } from '../constants/productConstants';

const initialState = {
  products: [],
  product: []
};

export const productReducer = (state = initialState.products, { type, payload }) => {
  switch (type) {
    case ALL_PRODUCT_REQUEST:
      return {
        loading: true,
        products: []
      };
    case ALL_PRODUCT_SUCCESS:
      return {
        loading: false,
        products: payload.products,
        productsCount: payload.productsCount
      };
    case ALL_PRODUCT_FAIL:
      return {
        loading: false,
        error: payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const productDetailsReducer = (state = initialState.product, { type, payload }) => {
  switch (type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        loading: true,
        ...state
      };
    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: payload
      };
    case PRODUCT_DETAILS_FAIL:
      return {
        loading: false,
        error: payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};
