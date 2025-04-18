const { Occasion } = require("../models");

// جلب جميع المناسبات
exports.getAllOccasions = async (req, res) => {
  try {
    const occasions = await Occasion.findAll();
    res.json({ success: true, data: occasions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "خطأ أثناء جلب المناسبات", error });
  }
};

// جلب مناسبة حسب ID
exports.getOccasionById = async (req, res) => {
  try {
    const occasion = await Occasion.findByPk(req.params.id);
    if (!occasion)
      return res
        .status(404)
        .json({ success: false, message: "المناسبة غير موجودة" });

    res.json({ success: true, data: occasion });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "خطأ أثناء جلب المناسبة", error });
  }
};

// إنشاء مناسبة جديدة
exports.createOccasion = async (req, res) => {
  try {
    const { name } = req.body;
    const newOccasion = await Occasion.create({ name });
    res.status(201).json({ success: true, data: newOccasion });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "خطأ أثناء إنشاء المناسبة", error });
  }
};

// تحديث مناسبة
exports.updateOccasion = async (req, res) => {
  try {
    const occasion = await Occasion.findByPk(req.params.id);
    if (!occasion)
      return res
        .status(404)
        .json({ success: false, message: "المناسبة غير موجودة" });

    const { name } = req.body;
    await occasion.update({ name });
    res.json({ success: true, data: occasion });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "خطأ أثناء تحديث المناسبة", error });
  }
};

// حذف مناسبة
exports.deleteOccasion = async (req, res) => {
  try {
    const occasion = await Occasion.findByPk(req.params.id);
    if (!occasion)
      return res
        .status(404)
        .json({ success: false, message: "المناسبة غير موجودة" });

    await occasion.destroy();
    res.json({ success: true, message: "تم حذف المناسبة بنجاح" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "خطأ أثناء حذف المناسبة", error });
  }
};

