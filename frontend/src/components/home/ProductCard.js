import { Rating } from '@material-ui/lab';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';

const ProductCard = ({ product }) => {
  // console.log(product);
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5
  };

  return (
    <NavLink className='productCard' to={`/product/${product._id}`}>
      <Card sx={{ minWidth: 225, maxWidth: 230 }}>
        <CardMedia component='img' height='275' image={product.images[0].url} alt={product.name} />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {product.name}
          </Typography>
          <Typography gutterBottom variant='body2' component='div'>
            <Rating {...options} />
          </Typography>
          <Typography gutterBottom variant='body2' component='div'>
            ({product.numOfReviews} Reviews)
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {`$${product.price}`}
          </Typography>
        </CardContent>
      </Card>
    </NavLink>
  );
};

export default ProductCard;
