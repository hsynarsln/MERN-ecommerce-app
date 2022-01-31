import { CLEAR_ERRORS, CREATE_ORDER_FAIL, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, MY_ORDERS_FAIL, MY_ORDERS_REQUEST, MY_ORDERS_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS } from '../constants/orderConstants';

const initialState = {
  order: {},
  orders: [],
  orderDetail: {}
};

export const newOrderReducer = (state = initialState.order, { type, payload }) => {
  switch (type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case CREATE_ORDER_SUCCESS:
      return {
        loading: false,
        order: payload
      };
    case CREATE_ORDER_FAIL:
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

export const myOrdersReducer = (state = initialState.orders, { type, payload }) => {
  switch (type) {
    case MY_ORDERS_REQUEST:
      return {
        loading: true
      };
    case MY_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: payload
      };
    case MY_ORDERS_FAIL:
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

export const orderDetailReducer = (state = initialState.orderDetail, { type, payload }) => {
  switch (type) {
    case ORDER_DETAILS_REQUEST:
      return {
        loading: true
      };
    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        orderDetail: payload
      };
    case ORDER_DETAILS_FAIL:
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
