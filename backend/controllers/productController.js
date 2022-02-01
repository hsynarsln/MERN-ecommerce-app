import cloudinary from 'cloudinary';
import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import ProductModel from '../models/productModel.js';
import ApiFeatures from '../utils/apifeatures.js';
import ErrorHandler from '../utils/errorhandler.js';

//! CREATE PRODUCT
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'products'
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await ProductModel.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

//! GET PRODUCTS
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  //! Search, Filter & Pagination to backend
  const resultPerPage = 4;
  const productsCount = await ProductModel.countDocuments();
  // console.log(req.query);

  const apiFeature = new ApiFeatures(ProductModel.find(), req.query).search().filter();

  apiFeature.pagination(resultPerPage);

  let products = await apiFeature.query;
  // console.log(products);

  let filteredProductsCount = products.length;
  // console.log(filteredProductsCount);

  // console.log(products);

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount
  });
});

//! GET PRODUCTS (ADMIN)
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await ProductModel.find();

  res.status(200).json({
    success: true,
    products
  });
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
  // console.log(product);

  if (!product) {
    return next(new ErrorHandler('Porduct not found', 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

//! CREATE NEW REVIEW OR UPDATE THE REVIEW
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await ProductModel.findById(productId);

  const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

  if (isReviewed) {
    product.reviews.forEach(rev => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach(rev => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  });
});

//! GET ALL REVIEWS OF A PRODUCT
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.query);
  const product = await ProductModel.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
});

//! DELETE REVIEW
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

  let avg = 0;
  reviews.forEach(rev => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;

  await product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false
    }
  );

  res.status(200).json({
    success: true
  });
});
