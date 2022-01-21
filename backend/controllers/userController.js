import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import User from '../models/userModel.js';
import ErrorHandler from '../utils/errorhandler.js';
import sendToken from '../utils/jwtToken.js';
import sendEmail from '../utils/sendEmail.js';

//! REGISTER
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'this is a sample id',
      url: 'profilepicUrl'
    }
  });

  sendToken(user, 201, res);
});

//! LOGIN
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //! check if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler('Please Enter Email & Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid email or password'));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  sendToken(user, 200, res);
});

//! LOGOUT USER
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged Out'
  });
});

//! FORGOT PASSWORD
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  //! get resetpassword token
  const resetToken = () => {
    //! generating token
    const resetTokenie = crypto.randomBytes(20).toString('hex');

    //! hashing and adding resetPasswordToken to userSchema
    user.resetPasswordToken = crypto.createHash('sha256').update(resetTokenie).digest('hex');

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetTokenie;
  };
  // console.log(resetToken());

  await user.save({ validateBeforeSave: false });

  // console.log(req.get('host'));
  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken()}`;
  // console.log(resetPasswordUrl);

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  // console.log(message);

  try {
    // console.log(user.email);
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//! RESET PASSWORD
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  //! creating token hash
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() } //! greater than date.now()
  });

  if (!user) {
    return next(new ErrorHandler('Reset Password Token is invalid or has been expired', 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not password', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//! GET USER DETAILS
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

//! UPDATE USER PASSWORD
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old Password is incorrect', 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler('password does not match', 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//! UPDATE USER PROFILE
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  };

  //! we will add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true
  });
});

//! GET ALL USERS (ADMIN)
export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  });
});

//! GET SINGLE USERS (ADMIN)
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user
  });
});

//! UPDATE USER ROLE --ADMIN
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  //! we will add cloudinary later

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true
  });
});

//! DELETE USER --ADMIN
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  //! we will remove cloudinary later

  if (!user) {
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: 'User deleted Successfully'
  });
});
