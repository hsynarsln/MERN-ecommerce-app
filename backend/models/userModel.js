import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
//? mükerrer email kaydını önlemek için --> npm i --save mongoose-unique-validator --> then;
import validator from 'validator';

const { model, Schema } = mongoose;

const userSchema = Schema({
  name: { type: String, required: [true, 'Please Enter Your Name'], maxLength: [30, 'Name cannot exceed 30 characters'] },
  email: { type: String, required: [true, 'Please Enter Your Email'], unique: true, validate: [validator.isEmail, 'Please Enter a valid Email'] }, //? unique: true --> it's not a validator. this means it does not automatşically throw error. if we try to add a new entry with an email adress taht does not already exist, it will eventually lead to problems but we cant rely on this validating data when we try to save it. Also allows us mongoose and mongodb to do some internall optimizations from a performance perspective
  password: { type: String, required: [true, 'Please Enter Your Password'], minLength: [8, 'Password should be greater than 8 characters'], select: false },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//! JWT TOKEN (userController'da tanımladım)
// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE
//   });
// };

//! compare password (userController'da tanımladım)
// userSchema.methods.comparePassword = async enteredPassword => {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

//! generating password reset token
userSchema.methods.getResetPasswordToken = () => {
  //! generating token
  const resetToken = crypto.randomBytes(20).toString('hex');

  //! hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export default model('User', userSchema);
