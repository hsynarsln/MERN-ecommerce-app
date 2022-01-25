import jwt from 'jsonwebtoken';

//! create token and saving in cookie
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  //! options for cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  console.log(options);
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token
  });
};

export default sendToken;
