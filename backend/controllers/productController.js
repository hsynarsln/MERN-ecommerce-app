import ProductModel from '../models/productModel.js';

//! CREATE PRODUCT
export const createProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.create(req.body);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//! GET PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//! UPDATE PRODUCT
export const updateProduct = async (req, res, next) => {
  let product = ProductModel.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'Product not found'
    });
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
};

//! DELETE PRODUCT
export const deleteProduct = async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'Product not found'
    });
  }

  await product.remove();

  res.json({ success: true, message: 'Post deleted successfully' });
};

//! GET PRODUCT DETAILS
export const getProductDetails = async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    product
  });
};
