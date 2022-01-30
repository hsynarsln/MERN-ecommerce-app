import axios from 'axios';
import { CLEAR_ERRORS, CREATE_ORDER_FAIL, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS } from '../constants/orderConstants';

export const createOrder = order => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const { data } = await axios.post(
      'http://localhost:4000/api/v1/order/new',
      order,
      { withCredentials: true },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response.data.message
    });
  }
};

//! Clearing Errors
export const clearErrors = () => async dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
