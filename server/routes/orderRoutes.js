const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// Route to create a new order
router.post("/create-order", orderController.createOrder);
router.get("/count", orderController.getOrderCount);
router.get(
  "/get",
  authMiddleware,
  adminMiddleware,
  orderController.getAllOrders
);
router.put(
  "/:orderId/status",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
);

router.get("/get-profile-orders", authMiddleware, orderController.getUserProfile);
module.exports = router;
