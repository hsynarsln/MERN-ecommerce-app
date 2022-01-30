import { Typography } from '@material-ui/core';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearErrors, createOrder } from '../../redux/actions/orderAction';
import MetaData from '../layout/Metadata';
import CheckoutSteps from './CheckoutSteps';
// import { clearErrors, createOrder } from '../../actions/orderAction';
import './Payment.css';

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.user);
  const { error } = useSelector(state => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100)
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice
  };

  const submitHandler = async e => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/v1/payment/process',
        paymentData,
        { withCredentials: true },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country
            }
          }
        }
      });

      if (result.error) {
        payBtn.current.disabled = false;

        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status
          };

          dispatch(createOrder(order));

          navigate('/success');
        } else {
          alert.error("There's some issue while processing payment ");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <div style={{ marginTop: '5rem' }}>
      <MetaData title='Payment' />
      <CheckoutSteps activeStep={2} />
      <div className='paymentContainer'>
        <form className='paymentForm' onSubmit={e => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className='paymentInput' />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className='paymentInput' />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className='paymentInput' />
          </div>

          <input type='submit' value={`Pay - $${orderInfo && orderInfo.totalPrice}`} ref={payBtn} className='paymentFormBtn' />
        </form>
      </div>
    </div>
  );
};

export default Payment;
