const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");

// Create Product
router.post("/create-products", productController.createProduct);

// Get All Products
router.get("/getAllProducts", productController.getAllProducts);

// Edit Single Product
router.put("/update-products/:id", productController.updateProduct);

// Delete Single Product
router.delete("/products-delete/:id", productController.deleteProduct);

// Get Product Count
router.get("/count-products", productController.getProductCount);

module.exports = router;
