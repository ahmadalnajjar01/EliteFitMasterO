const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/customers-users", userController.getAllCustomers);
router.get("/customers/count", userController.getCustomerCount);

module.exports = router;
