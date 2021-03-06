import bcrypt from 'bcryptjs';
import cloudinary from 'cloudinary';
import crypto from 'crypto';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import User from '../models/userModel.js';
import ErrorHandler from '../utils/errorhandler.js';
import sendToken from '../utils/jwtToken.js';
import sendEmail from '../utils/sendEmail.js';

//! REGISTER
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  //! image upload to cloudinary
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: 'scale'
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      // public_id: 'this is a sample id',
      // url: 'profilepicUrl'
      public_id: myCloud.public_id,
      url: myCloud.secure_url
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
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true
  };
  console.log(options);
  res.status(200).cookie('token', null, options).json({
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

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //! 15 minutes

    return resetTokenie;
  };
  // console.log(resetToken());

  // console.log(req.get('host'));
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken()}`;
  // console.log(resetPasswordUrl);

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  // console.log(message);

  try {
    await user.save({ validateBeforeSave: false });

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
  // console.log(resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  // console.log(user);

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

  //! update image
  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale'
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    };
  }

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

  await User.findByIdAndUpdate(req.params.id, newUserData, {
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

  if (!user) {
    return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
  }

  //! delete from cloudinary
  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: 'User deleted Successfully'
  });
});
