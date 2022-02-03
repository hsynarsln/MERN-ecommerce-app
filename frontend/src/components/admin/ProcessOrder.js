import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Button, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { clearErrors, getOrderDetails, updateOrder } from '../../redux/actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../redux/constants/orderConstants';
import Loader from '../layout/loader/Loader';
import MetaData from '../layout/Metadata';
import './ProcessOrder.css';
import Sidebar from './Sidebar';

const ProcessOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { orderDetail, error, loading } = useSelector(state => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector(state => state.order);
  const [status, setStatus] = useState('');

  const updateOrderSubmitHandler = e => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set('status', status);

    dispatch(updateOrder(id, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success('Order Updated Successfully');
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error, id, isUpdated, updateError]);

  return (
    <Fragment>
      <MetaData title='Process Order' />
      <div className='dashboard'>
        <Sidebar />
        <div className='newProductContainer'>
          {loading ? (
            <Loader />
          ) : (
            <div
              className='confirmOrderPage'
              style={{
                display: orderDetail?.orderStatus === 'Delivered' ? 'block' : 'grid'
              }}
            >
              <div>
                <div className='confirmshippingArea'>
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
                <div className='confirmCartItems'>
                  <Typography>Your Cart Items:</Typography>
                  <div className='confirmCartItemsContainer'>
                    {orderDetail?.orderItems &&
                      orderDetail.orderItems.map(item => (
                        <div key={item.product}>
                          <img src={item.image} alt='Product' />
                          <NavLink to={`/product/${item.product}`}>{item.name}</NavLink>{' '}
                          <span>
                            {item.quantity} X $ {item.price} = <b>$ {item.price * item.quantity}</b>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/*  */}
              <div
                style={{
                  display: orderDetail?.orderStatus === 'Delivered' ? 'none' : 'block'
                }}
              >
                <form className='updateOrderForm' onSubmit={updateOrderSubmitHandler}>
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={e => setStatus(e.target.value)}>
                      <option value=''>Choose Category</option>
                      {orderDetail?.orderStatus === 'Processing' && <option value='Shipped'>Shipped</option>}

                      {orderDetail?.orderStatus === 'Shipped' && <option value='Delivered'>Delivered</option>}
                    </select>
                  </div>

                  <Button id='createProductBtn' type='submit' disabled={loading ? true : false || status === '' ? true : false}>
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
