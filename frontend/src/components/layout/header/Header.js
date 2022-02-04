import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Button, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../../images/logos.png';
import UserOptions from './UserOptions';

const Header = () => {
  const navigate = useNavigate();
  //! username ve userPhoto bilgilerini retrieve yapıyoruz
  const { user, isAuthenticated } = useSelector(state => state.user);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //! google authentication (look at the docs)
  const handleAuth = async () => {
    navigate('/login');
  };

  return (
    <Nav>
      <Logo>
        <img src={logo} alt='' style={{ width: '3rem' }} />
      </Logo>

      {/* //! user mevcut değilse --> login page'e git. mevcut ise navMenu görünsün */}

      <HamburgerMenu>
        <Button id='basic-button' aria-controls={open ? 'basic-menu' : undefined} aria-haspopup='true' aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
          <MenuIcon fontSize='large' />
        </Button>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
        >
          <NavLink to='/'>
            <MenuItemWrapper>
              <MenuItem onClick={handleClose}>
                <span>Home</span>
              </MenuItem>
            </MenuItemWrapper>
          </NavLink>
          <br />
          <NavLink to='/products'>
            <MenuItemWrapper>
              <MenuItem onClick={handleClose}>
                <span>Products</span>
              </MenuItem>
            </MenuItemWrapper>
          </NavLink>
          <br />
          <NavLink to='/contact'>
            <MenuItemWrapper>
              <MenuItem onClick={handleClose}>
                <span>Contact</span>
              </MenuItem>
            </MenuItemWrapper>
          </NavLink>
          <br />
          <NavLink to='/about'>
            <MenuItemWrapper>
              <MenuItem onClick={handleClose}>
                <span>About</span>
              </MenuItem>
            </MenuItemWrapper>
          </NavLink>
        </Menu>
      </HamburgerMenu>
      <>
        <NavMenu>
          <NavLink to='/' style={{ textDecoration: 'none' }}>
            <span>HOME</span>
          </NavLink>
          <NavLink to='/products' style={{ textDecoration: 'none' }}>
            <span>PRODUCTS</span>
          </NavLink>
          <NavLink to='/contact' style={{ textDecoration: 'none' }}>
            <span>CONTACT</span>
          </NavLink>
          <NavLink to='/about' style={{ textDecoration: 'none' }}>
            <span>ABOUT</span>
          </NavLink>
        </NavMenu>
        <Icons>
          <NavLink to='/search' style={{ textDecoration: 'none' }}>
            <SearchIcon color='info' fontSize='medium' style={{ marginRight: '2rem' }} />
          </NavLink>
          <NavLink to='/cart' style={{ textDecoration: 'none' }}>
            <ShoppingCartOutlinedIcon color='info' fontSize='medium' />
          </NavLink>
        </Icons>
        {!isAuthenticated ? (
          <Login onClick={handleAuth}>Login</Login>
        ) : (
          <Profile>
            <UserOptions user={user} />
          </Profile>
        )}
      </>
    </Nav>
  );
};

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 3;
`;

const MenuItemWrapper = styled.div`
  margin: -0.5rem 0;
  padding: 0.2rem 2rem;
  background-color: #090b13;
  span {
    text-decoration: none;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1.42px;
    line-height: 1.08;
    padding: 2px 0px;
    white-space: nowrap;
    position: relative;
    &:before {
      background-color: #fff;
      border-radius: 0px 0px 4px 4px;
      bottom: -6px;
      content: '';
      height: 2px;
      left: 0px;
      opacity: 0;
      position: absolute;
      right: 0px;
      transform-origin: left center;
      transform: scaleX(0);
      transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
      visibility: hidden;
      width: auto;
    }
  }
  &:hover {
    span:before {
      transform: scaleX(1);
      visibility: visible;
      opacity: 1 !important;
    }
  }
`;

const Logo = styled.a`
  padding: 0;
  width: 80px;
  margin-top: 4px;
  max-height: 70px;
  font-size: 0;
  display: inline-block;

  img {
    display: block;
    width: 100%;
  }
`;

const HamburgerMenu = styled.div`
  z-index: 1;
  color: #f9f9f9;
  @media (min-width: 768px) {
    display: none;
  }
`;

const NavMenu = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: flex-end;
  margin: 0px;
  padding: 0px;
  position: relative;
  margin-right: auto;
  margin-left: 25px;
  a {
    display: flex;
    align-items: center;
    padding: 0 12px;
    img {
      height: 20px;
      min-width: 20px;
      width: 20px;
      z-index: auto;
    }
    span {
      color: rgb(249, 249, 249);
      font-size: 13px;
      letter-spacing: 1.42px;
      line-height: 1.08;
      padding: 2px 0px;
      white-space: nowrap;
      position: relative;
      &:before {
        background-color: rgb(249, 249, 249);
        border-radius: 0px 0px 4px 4px;
        bottom: -6px;
        content: '';
        height: 2px;
        left: 0px;
        opacity: 0;
        position: absolute;
        right: 0px;
        transform-origin: left center;
        transform: scaleX(0);
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        visibility: hidden;
        width: auto;
      }
    }
    &:hover {
      span:before {
        transform: scaleX(1);
        visibility: visible;
        opacity: 1 !important;
      }
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const Login = styled.a`
  background-color: #f9f9f9;
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 3px solid grey;
  border-radius: 4px;
  transition: all 0.2s ease 0s;
  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
    transform: scale(1.1);
  }
`;

const Icons = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  margin: 0 5rem;
`;

const Profile = styled.div`
  margin-top: 15rem;
  margin-left: 2rem;
`;

export default Header;
