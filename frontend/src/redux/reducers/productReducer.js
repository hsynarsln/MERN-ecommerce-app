import { ADMIN_PRODUCT_FAIL, ADMIN_PRODUCT_REQUEST, ADMIN_PRODUCT_SUCCESS, ALL_PRODUCT_FAIL, ALL_PRODUCT_REQUEST, ALL_PRODUCT_SUCCESS, CLEAR_ERRORS, NEW_PRODUCT_FAIL, NEW_PRODUCT_REQUEST, NEW_PRODUCT_RESET, NEW_PRODUCT_SUCCESS, NEW_REVIEW_FAIL, NEW_REVIEW_REQUEST, NEW_REVIEW_RESET, NEW_REVIEW_SUCCESS, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS } from '../constants/productConstants';

const initialState = {
  products: [],
  product: {},
  newProduct: {}
};

export const productReducer = (state = initialState.products, { type, payload }) => {
  switch (type) {
    case ALL_PRODUCT_REQUEST:
    case ADMIN_PRODUCT_REQUEST:
      return {
        loading: true,
        products: []
      };
    case ALL_PRODUCT_SUCCESS:
      return {
        loading: false,
        products: payload.products,
        productsCount: payload.productsCount,
        resultPerPage: payload.resultPerPage,
        filteredProductsCount: payload.filteredProductsCount
      };
    case ADMIN_PRODUCT_SUCCESS:
      return {
        loading: false,
        products: payload
      };
    case ALL_PRODUCT_FAIL:
    case ADMIN_PRODUCT_FAIL:
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

export const newProductReducer = (state = initialState.newProduct, { type, payload }) => {
  switch (type) {
    case NEW_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case NEW_PRODUCT_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        newProduct: payload.newProduct
      };
    case NEW_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case NEW_PRODUCT_RESET:
      return {
        ...state,
        success: false
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

export const newReviewReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case NEW_REVIEW_REQUEST:
      return {
        ...state,
        loading: true
      };
    case NEW_REVIEW_SUCCESS:
      return {
        loading: false,
        success: payload
      };
    case NEW_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case NEW_REVIEW_RESET:
      return {
        ...state,
        success: false
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
