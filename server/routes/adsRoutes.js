const express = require("express");
const router = express.Router();
const adsController = require("../controllers/adsController");

router.get("/", adsController.getAllAds);

router.put("/:id", adsController.updateAd);

module.exports = router;
