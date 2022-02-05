import { Button } from '@mui/material';
import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className='contactContainer'>
      <a className='mailBtn' href='mailto:hsyn06arslan@gmail.com'>
        <Button>Contact: hsyn06arslan@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
