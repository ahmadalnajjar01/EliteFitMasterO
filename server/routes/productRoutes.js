const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/products", productController.getAllProducts);

router.get("/products/:id", productController.getProductById);

router.get("/category/:category", productController.getProductsByCategory);

router.get("/arrivals-products", productController.getNewArrivals);

router.get("/sale-products", productController.getNewSale);


router.post(
  "/:productId/occasions/:occasionId",
  productController.addOccasionToProduct
);
router.delete(
  "/:productId/occasions/:occasionId",
  productController.removeOccasionFromProduct
);

// جلب المناسبات لمنتج معين
router.get("/:productId/occasions", productController.getOccasionsByProduct);

// جلب المنتجات التابعة لمناسبة معينة
// routes/productRoutes.js
router.get("/occasions/:occasionName", productController.getProductsByOccasion);


module.exports = router;
