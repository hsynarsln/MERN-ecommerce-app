import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Backdrop } from '@mui/material';
import React, { useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import usersvg from '../../../images/user.svg';
import { logout } from '../../../redux/actions/userAction';
import './UserOptions.css';

const UserOptions = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { cartItems } = useSelector(state => state.cart);

  const options = [
    { icon: <ListAltIcon />, name: 'Orders', func: orders },
    { icon: <PersonIcon />, name: 'Profile', func: account },
    {
      icon: <ShoppingCartIcon style={{ color: cartItems.length > 0 ? 'red' : 'unset' }} />,
      name: `Cart(${cartItems.length})`,
      func: cart
    },
    { icon: <ExitToAppIcon />, name: 'Logout', func: logoutUser }
  ];

  if (user.role === 'admin') {
    options.unshift({
      icon: <DashboardIcon />,
      name: 'Dashboard',
      func: dashboard
    });
  }

  function dashboard() {
    navigate('/admin/dashboard');
  }

  function orders() {
    navigate('/orders');
  }
  function account() {
    navigate('/account');
  }
  function cart() {
    navigate('/cart');
  }
  function logoutUser() {
    dispatch(logout());
    alert.success('Logout Successfully');
  }

  return (
    <div>
      <Backdrop open={open} style={{ zIndex: '10' }} />
      <SpeedDial ariaLabel='SpeedDial tooltip example' onClose={() => setOpen(false)} onOpen={() => setOpen(true)} style={{ zIndex: '110' }} open={open} direction='down' className='speedDial' icon={<img className='speedDialIcon' src={user.avatar.url ? user.avatar.url : usersvg} alt='Profile' />}>
        {options.map(item => (
          <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func} tooltipOpen={window.innerWidth <= 600 ? true : false} />
        ))}
      </SpeedDial>
    </div>
  );
};

export default UserOptions;
