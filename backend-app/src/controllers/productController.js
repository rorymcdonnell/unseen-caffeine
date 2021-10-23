import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);

  res.json(products);
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getCarouselProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ name: { $regex: "250g" } }).limit(4);

  // const products = [
  //   {
  //     name: "HUNTER KILLER COFFEE 250g",
  //     image: "/images/unseencaffeine-hunter-killer-coffee.jpeg",
  //     description:
  //       "At present all of his 6 hectares are organic shaded coffee and is in the process of obtaining the relevant certifications. Don Jose bought the farm 6 years ago and has invested time and effort to re-purpose a patch for a combination of coffee, honey, plantain and even cassava. He is a true believer of preserving Colombia's biodiversity so most of the farm remains a virgin forest where his cattle mingles.",
  //     brand: "unseen caffeine",
  //     category: "coffee",
  //     price: 9.0,
  //     countInStock: 3,
  //     rating: 0,
  //     numReviews: 0,
  //   },
  //   {
  //     name: "DREADNOUGHT COFFEE 250g",
  //     image: "/images/dreadnought-unseen-caffeine-250g.jpeg",
  //     description:
  //       "At present all of his 6 hectares are organic shaded coffee and is in the process of obtaining the relevant certifications. Don Jose bought the farm 6 years ago and has invested time and effort to re-purpose a patch for a combination of coffee, honey, plantain and even cassava. He is a true believer of preserving Colombia's biodiversity so most of the farm remains a virgin forest where his cattle mingles.",
  //     brand: "unseen caffeine",
  //     category: "coffee",
  //     price: 9.0,
  //     countInStock: 3,
  //     rating: 0,
  //     numReviews: 0,
  //   },
  //   {
  //     name: "DEEP PEACE COFFEE 250g",
  //     image: "/images/deep-peace-250g.jpeg",
  //     description:
  //       "At present all of his 6 hectares are organic shaded coffee and is in the process of obtaining the relevant certifications. Don Jose bought the farm 6 years ago and has invested time and effort to re-purpose a patch for a combination of coffee, honey, plantain and even cassava. He is a true believer of preserving Colombia's biodiversity so most of the farm remains a virgin forest where his cattle mingles.",
  //     brand: "unseen caffeine",
  //     category: "coffee",
  //     price: 9.0,
  //     countInStock: 3,
  //     rating: 0,
  //     numReviews: 0,
  //   },
  //   {
  //     name: "DEPTH CHARGE COFFEE 250g",
  //     image: "/images/depth-charge-unseen-caffeine-250g.png",
  //     description:
  //       "At present all of his 6 hectares are organic shaded coffee and is in the process of obtaining the relevant certifications. Don Jose bought the farm 6 years ago and has invested time and effort to re-purpose a patch for a combination of coffee, honey, plantain and even cassava. He is a true believer of preserving Colombia's biodiversity so most of the farm remains a virgin forest where his cattle mingles.",
  //     brand: "unseen caffeine",
  //     category: "coffee",
  //     price: 9.0,
  //     countInStock: 3,
  //     rating: 0,
  //     numReviews: 0,
  //   },
  // ];

  res.json(products);
});

export {
  getCarouselProducts,
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
