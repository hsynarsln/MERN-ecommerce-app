import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import ProductModel from '../models/productModel.js';
import ApiFeatures from '../utils/apifeatures.js';
import ErrorHandler from '../utils/errorhandler.js';

//! CREATE PRODUCT
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await ProductModel.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

//! GET PRODUCTS
export const getAllProducts = catchAsyncErrors(async (req, res) => {
  //! Search, Filter & Pagination to backend
  const resultPerPage = 5;
  const productCount = await ProductModel.countDocuments();

  const apiFeature = new ApiFeatures(ProductModel.find(), req.query).search().filter().pagination(resultPerPage);
  // const products = await ProductModel.find();
  const products = await apiFeature.query;

  res.status(200).json({ success: true, products });
});

//! UPDATE PRODUCT
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = ProductModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Porduct not found', 404));
  }

  product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    product
  });
});

//! DELETE PRODUCT
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Porduct not found', 404));
  }

  await product.remove();

  res.json({ success: true, message: 'Post deleted successfully' });
});

//! GET PRODUCT DETAILS
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Porduct not found', 404));
  }

  res.status(200).json({
    success: true,
    product,
    productCount
  });
});
