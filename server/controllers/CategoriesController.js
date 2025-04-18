const { Category } = require("../models");
// ✅ جلب جميع الفئات
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll(); // Use `Category`, not `Categories`
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "خطأ أثناء جلب الفئات" });
  }
};

// ✅ جلب فئة حسب ID
exports.getCategoriesById = async (req, res) => {
  try {
    const Categories = await Categories.findByPk(req.params.id);
    if (!Categories)
      return res.status(404).json({ message: "الفئة غير موجودة" });
    res.json(Categories);
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء جلب الفئة", error });
  }
};

// ✅ إنشاء فئة جديدة
exports.createCategories = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategories = await Categories.create({ name });
    res.status(201).json(newCategories);
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء إنشاء الفئة", error });
  }
};

// ✅ تحديث الفئة
exports.updateCategories = async (req, res) => {
  try {
    const Categories = await Categories.findByPk(req.params.id);
    if (!Categories)
      return res.status(404).json({ message: "الفئة غير موجودة" });

    const { name } = req.body;
    await Categories.update({ name });
    res.json(Categories);
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء تحديث الفئة", error });
  }
};

// ✅ حذف الفئة
exports.deleteCategories = async (req, res) => {
  try {
    const Categories = await Categories.findByPk(req.params.id);
    if (!Categories)
      return res.status(404).json({ message: "الفئة غير موجودة" });

    await Categories.destroy();
    res.json({ message: "تم حذف الفئة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء حذف الفئة", error });
  }
};
