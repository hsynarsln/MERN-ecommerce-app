import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Button } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearErrors, getUserDetails, updateUser } from '../../redux/actions/userAction';
import { UPDATE_USER_RESET } from '../../redux/constants/userConstants';
import Loader from '../layout/loader/Loader';
import MetaData from '../layout/Metadata';
import Sidebar from './Sidebar';

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, user } = useSelector(state => state.userDetails);

  const { loading: updateLoading, error: updateError, isUpdated } = useSelector(state => state.profile);

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [role, setRole] = useState(user?.role);

  useEffect(() => {
    if (!user) {
      dispatch(getUserDetails(id));
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success('User Updated Successfully');
      navigate('/admin/users');
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, alert, error, navigate, isUpdated, updateError, user, id]);

  const updateUserSubmitHandler = e => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('role', role);

    dispatch(updateUser(id, myForm));
  };

  return (
    <Fragment>
      <MetaData title='Update User' />
      <div className='dashboard'>
        <Sidebar />
        <div className='newProductContainer'>
          {loading ? (
            <Loader />
          ) : (
            <form className='createProductForm' onSubmit={updateUserSubmitHandler}>
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input type='text' placeholder='Name' required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <MailOutlineIcon />
                <input type='email' placeholder='Email' required value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value=''>Choose Role</option>
                  <option value='admin'>Admin</option>
                  <option value='user'>User</option>
                </select>
              </div>

              <Button id='createProductBtn' type='submit' disabled={updateLoading ? true : false || role === '' ? true : false}>
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
