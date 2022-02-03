import { Typography } from '@mui/material';
import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getAllOrders } from '../../redux/actions/orderAction';
import { getAdminProducts } from '../../redux/actions/productAction';
import { getAllUsers } from '../../redux/actions/userAction';
import MetaData from '../layout/Metadata';
import './Dashboard.css';
import Sidebar from './Sidebar';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products);
  const { allOrders } = useSelector(state => state.allOrders);
  const { users } = useSelector(state => state.allUser);

  let outOfStock = 0;

  products &&
    products.forEach(item => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  const lineState = {
    labels: ['Initial Amount', 'Amount Earned'],
    datasets: [
      {
        label: 'TOTAL AMOUNT',
        backgroundColor: ['tomato'],
        hoverBackgroundColor: ['rgb(197, 72, 49)'],
        data: [0, outOfStock]
      }
    ]
  };

  const doughnutState = {
    labels: ['Out of Stock', 'InStock'],
    datasets: [
      {
        backgroundColor: ['#00A6B4', '#6800B4'],
        hoverBackgroundColor: ['#4B5000', '#35014F'],
        data: [outOfStock, products?.length - outOfStock]
      }
    ]
  };

  return (
    <div className='dashboard'>
      <MetaData title='Dashboard - Admin Panel' />
      <Sidebar />

      <div className='dashboardContainer'>
        <Typography component='h1'>Dashboard</Typography>

        <div className='dashboardSummary'>
          <div>
            <p>{/* Total Amount <br />$ {totalAmount} */}</p>
          </div>
          <div className='dashboardSummaryBox2'>
            <NavLink to='/admin/products'>
              <p>Product</p>
              <p>{products && products.length}</p>
            </NavLink>
            <NavLink to='/admin/orders'>
              <p>Orders</p>
              <p>{allOrders && allOrders.length}</p>
              {/* <p>{orders && orders.length}</p> */}
            </NavLink>
            <NavLink to='/admin/users'>
              <p>Users</p>
              <p>{users && users.length}</p>
              {/* <p>{users && users.length}</p> */}
            </NavLink>
          </div>
        </div>

        <div className='lineChart'>
          <Line data={lineState} />
        </div>

        <div className='doughnutChart'>
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
