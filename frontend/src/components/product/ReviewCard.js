import { Rating } from '@material-ui/lab';
import React from 'react';
import usersvg from '../../images/user.svg';

const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5
  };

  return (
    <div className='reviewCard'>
      <img src={usersvg} alt='User' />
      <p>{review.name}</p>
      <Rating {...options} />
      <span className='reviewCardComment'>{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
