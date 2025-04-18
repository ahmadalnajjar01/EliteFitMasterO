const express = require("express");
const router = express.Router();
const occasionController = require("../controllers/occasionController");

// جلب جميع المناسبات
router.get("/get-all", occasionController.getAllOccasions);
// جلب مناسبة واحدة بالـID
router.get("/:id", occasionController.getOccasionById);
// إنشاء مناسبة جديدة
router.post("/", occasionController.createOccasion);
// تحديث مناسبة
router.put("/:id", occasionController.updateOccasion);
// حذف مناسبة
router.delete("/:id", occasionController.deleteOccasion);

module.exports = router;
