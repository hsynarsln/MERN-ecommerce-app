import { Typography } from '@mui/material';
import React, { Fragment, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { clearErrors, getOrderDetails } from '../../redux/actions/orderAction';
import Loader from '../layout/loader/Loader';
import MetaData from '../layout/Metadata';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const { orderDetail, error, loading } = useSelector(state => state.orderDetails);

  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error, id]);

  return (
    <div style={{ marginTop: '5rem' }}>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title='Order Details' />
          <div className='orderDetailsPage'>
            <div className='orderDetailsContainer'>
              <Typography component='h1'>Order #{orderDetail && orderDetail._id}</Typography>
              <Typography>Shipping Info</Typography>
              <div className='orderDetailsContainerBox'>
                <div>
                  <p>Name:</p>
                  <span>{orderDetail?.user && orderDetail.user.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>{orderDetail?.shippingInfo && orderDetail.shippingInfo.phoneNo}</span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>{orderDetail?.shippingInfo && `${orderDetail.shippingInfo.address}, ${orderDetail.shippingInfo.city}, ${orderDetail.shippingInfo.state}, ${orderDetail.shippingInfo.pinCode}, ${orderDetail.shippingInfo.country}`}</span>
                </div>
              </div>
              <Typography>Payment</Typography>
              <div className='orderDetailsContainerBox'>
                <div>
                  <p className={orderDetail?.paymentInfo && orderDetail.paymentInfo.status === 'succeeded' ? 'greenColor' : 'redColor'}>{orderDetail?.paymentInfo && orderDetail.paymentInfo.status === 'succeeded' ? 'PAID' : 'NOT PAID'}</p>
                </div>

                <div>
                  <p>Amount:</p>
                  <span>{orderDetail?.totalPrice && orderDetail.totalPrice}</span>
                </div>
              </div>

              <Typography>Order Status</Typography>
              <div className='orderDetailsContainerBox'>
                <div>
                  <p className={orderDetail?.orderStatus && orderDetail.orderStatus === 'Delivered' ? 'greenColor' : 'redColor'}>{orderDetail?.orderStatus && orderDetail.orderStatus}</p>
                </div>
              </div>
            </div>

            <div className='orderDetailsCartItems'>
              <Typography>Order Items:</Typography>
              <div className='orderDetailsCartItemsContainer'>
                {orderDetail?.orderItems &&
                  orderDetail.orderItems.map(item => (
                    <div key={item.product}>
                      <img src={item.image} alt='Product' />
                      <Link to={`/product/${item.product}`}>{item.name}</Link>{' '}
                      <span>
                        {item.quantity} X ₹{item.price} = <b>₹{item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default OrderDetails;
