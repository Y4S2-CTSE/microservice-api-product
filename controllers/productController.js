const Product = require('../models/product');
const mongoose = require('mongoose');

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      productName: req.body.productName,
      productCode: req.body.productCode,
      productType: req.body.productType,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// READ ALL
exports.getAllProducts = async (req, res) => {
  try {
    const { name, minPrice, maxPrice, productType } = req.query;
    let filter = {};

    if (name) {
      filter.productName = { $regex: new RegExp(name, 'i') };
    }

    if (productType) {
      filter.productType = { $regex: new RegExp('^' + productType + '$', 'i') };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(filter).select('-__v');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// READ ONE
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          productName: req.body.productName,
          productCode: req.body.productCode,
          productType: req.body.productType,
          description: req.body.description,
          image: req.body.image,
          price: req.body.price
        }
      },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};