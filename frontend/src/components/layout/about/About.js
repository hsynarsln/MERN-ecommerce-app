import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Avatar, Button, Typography } from '@mui/material';
import React from 'react';
import './About.css';

const About = () => {
  const visitInstagram = () => {
    window.location = 'https://www.linkedin.com/in/h%C3%BCseyin-arslan-1752b121a/';
  };

  return (
    <div className='aboutSection'>
      <div></div>
      <div className='aboutSectionGradient'></div>
      <div className='aboutSectionContainer'>
        <Typography component='h1'>About Us</Typography>

        <div>
          <div>
            <Avatar style={{ width: '10vmax', height: '10vmax', margin: '2vmax 0' }} src='https://res.cloudinary.com/dtgwjfhml/image/upload/v1644074419/avatars/profil_foto_jqluql.jpg' alt='Founder' />
            <Typography>Hüseyin ARSLAN</Typography>
            <Button onClick={visitInstagram} color='primary'>
              Visit LinkedIn
            </Button>
            <span>This is a sample wesbite made by @hsynarslan.</span>
          </div>
          <div className='aboutSectionContainer2'>
            <Typography component='h2'>Our Brands</Typography>
            <a href='https://www.linkedin.com/in/h%C3%BCseyin-arslan-1752b121a/' target='blank'>
              <LinkedInIcon className='youtubeSvgIcon' />
            </a>

            <a href='https://instagram.com' target='blank'>
              <InstagramIcon className='instagramSvgIcon' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
