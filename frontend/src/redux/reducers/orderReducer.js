import { CLEAR_ERRORS, CREATE_ORDER_FAIL, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS } from '../constants/orderConstants';

const initialState = {
  order: {}
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
