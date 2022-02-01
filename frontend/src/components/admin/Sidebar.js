import { TreeItem, TreeView } from '@material-ui/lab';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp';
import ImportExportSharpIcon from '@mui/icons-material/ImportExportSharp';
import ListAltSharpIcon from '@mui/icons-material/ListAltSharp';
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';
import PostAddSharpIcon from '@mui/icons-material/PostAddSharp';
import RateReviewSharpIcon from '@mui/icons-material/RateReviewSharp';
import { Link } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../images/logos.png';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <NavLink to='/'>
        <img src={logo} alt='Ecommerce' />
      </NavLink>
      <NavLink to='/admin/dashboard'>
        <p>
          <DashboardSharpIcon /> Dashboard
        </p>
      </NavLink>
      <Link>
        <TreeView defaultCollapseIcon={<ExpandMoreSharpIcon />} defaultExpandIcon={<ImportExportSharpIcon />}>
          <TreeItem nodeId='1' label='Products'>
            <NavLink to='/admin/products'>
              <TreeItem nodeId='2' label='All' icon={<PostAddSharpIcon />} />
            </NavLink>

            <NavLink to='/admin/product/new'>
              <TreeItem nodeId='3' label='Create' icon={<AddSharpIcon />} />
            </NavLink>
          </TreeItem>
        </TreeView>
      </Link>
      <NavLink to='/admin/orders'>
        <p>
          <ListAltSharpIcon />
          Orders
        </p>
      </NavLink>
      <NavLink to='/admin/users'>
        <p>
          <PeopleAltSharpIcon /> Users
        </p>
      </NavLink>
      <NavLink to='/admin/reviews'>
        <p>
          <RateReviewSharpIcon />
          Reviews
        </p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
