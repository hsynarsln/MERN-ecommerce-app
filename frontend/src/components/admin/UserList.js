import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { Fragment, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearErrors, deleteUser, getAllUsers } from '../../redux/actions/userAction';
import { DELETE_USER_RESET } from '../../redux/constants/userConstants';
import MetaData from '../layout/Metadata';
import './ProductList.css';
import Sidebar from './Sidebar';

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const alert = useAlert();

  const { error, users } = useSelector(state => state.allUser);

  const { error: deleteError, isDeleted, message } = useSelector(state => state.profile);

  const deleteUserHandler = id => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success(message);
      navigate('/admin/users');
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted, message]);

  const columns = [
    { field: 'id', headerName: 'User ID', minWidth: 180, flex: 0.8 },

    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 0.5
    },

    {
      field: 'role',
      headerName: 'Role',
      type: 'number',
      minWidth: 150,
      flex: 0.3,
      cellClassName: params => {
        return params.getValue(params.id, 'role') === 'admin' ? 'greenColor' : 'redColor';
      }
    },

    {
      field: 'actions',
      flex: 0.3,
      headerName: 'Actions',
      minWidth: 150,
      type: 'number',
      sortable: false,
      renderCell: params => {
        return (
          <Fragment>
            <NavLink to={`/admin/user/${params.getValue(params.id, 'id')}`}>
              <EditIcon />
            </NavLink>

            <Button onClick={() => deleteUserHandler(params.getValue(params.id, 'id'))}>
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      }
    }
  ];

  const rows = [];

  users &&
    users.forEach(item => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name
      });
    });
  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />

      <div className='dashboard'>
        <Sidebar />
        <div className='productListContainer'>
          <h1 id='productListHeading'>ALL USERS</h1>

          <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} disableSelectionOnClick className='productListTable' autoHeight />
        </div>
      </div>
    </Fragment>
  );
};

export default UserList;
