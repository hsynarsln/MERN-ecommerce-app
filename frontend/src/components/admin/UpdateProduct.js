import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import StorageIcon from '@mui/icons-material/Storage';
import { Button } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearErrors, getProductDetails, updateProduct } from '../../redux/actions/productAction';
import { UPDATE_PRODUCT_RESET } from '../../redux/constants/productConstants';
import MetaData from '../layout/Metadata';
import Sidebar from './Sidebar';

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, product } = useSelector(state => state.productDetails);

  const { loading, error: updateError, isUpdated } = useSelector(state => state.product);

  const [name, setName] = useState(product?.name);
  const [price, setPrice] = useState(product?.price);
  const [description, setDescription] = useState(product?.description);
  const [category, setCategory] = useState(product?.category);
  const [stock, setStock] = useState(product?.stock);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState(product?.images);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = ['Laptop', 'Footwear', 'Bottom', 'Tops', 'Attire', 'Camera', 'SmartPhones'];

  useEffect(() => {
    if (!product) {
      dispatch(getProductDetails(id));
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
      alert.success('Product Updated Successfully');
      navigate('/admin/products');
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, navigate, isUpdated, id, product, updateError]);

  const updateProductSubmitHandler = e => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set('name', name);
    myForm.set('price', price);
    myForm.set('description', description);
    myForm.set('category', category);
    myForm.set('stock', stock);

    images.forEach(image => {
      myForm.append('images', image);
    });
    dispatch(updateProduct(id, myForm));
  };

  const updateProductImagesChange = e => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview(old => [...old, reader.result]);
          setImages(old => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };
  return (
    <Fragment>
      <MetaData title='Create Product' />
      <div className='dashboard'>
        <Sidebar />
        <div className='newProductContainer'>
          <form className='createProductForm' encType='multipart/form-data' onSubmit={updateProductSubmitHandler}>
            <h1>Update Product</h1>

            <div>
              <SpellcheckIcon />
              <input type='text' placeholder='Product Name' required value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <AttachMoneyIcon />
              <input type='number' placeholder='Price' required onChange={e => setPrice(e.target.value)} value={price} />
            </div>

            <div>
              <DescriptionIcon />

              <textarea placeholder='Product Description' value={description} onChange={e => setDescription(e.target.value)} cols='30' rows='1'></textarea>
            </div>

            <div>
              <AccountTreeIcon />
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value=''>Choose Category</option>
                {categories.map(cate => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <StorageIcon />
              <input type='number' placeholder='Stock' required onChange={e => setStock(e.target.value)} value={stock} />
            </div>

            <div id='createProductFormFile'>
              <input type='file' name='avatar' accept='image/*' onChange={updateProductImagesChange} multiple />
            </div>

            <div id='createProductFormImage'>{oldImages && oldImages.map((image, index) => <img key={index} src={image.url} alt='Old Product Preview' />)}</div>

            <div id='createProductFormImage'>
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt='Product Preview' />
              ))}
            </div>

            <Button id='createProductBtn' type='submit' disabled={loading ? true : false}>
              Create
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;