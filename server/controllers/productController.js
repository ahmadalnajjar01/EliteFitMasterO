const { Product, Category, Occasion } = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء جلب المنتجات", error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "المنتج غير موجود" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "خطأ أثناء جلب المنتج", error });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.category;

    console.log(`✅ Fetching Products for Category: ${categoryName}`);

    const category = await Category.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `❌ No category found with name: ${categoryName}`,
      });
    }

    const products = await Product.findAll({
      where: { categoryId: category.id },
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `❌ No products found in category: ${categoryName}`,
      });
    }

    res.json({ success: true, products });
  } catch (error) {
    console.error(
      `🔥 Error fetching products for category: ${req.params.category}`,
      error
    );
    res.status(500).json({
      success: false,
      message: "🔥 Error fetching products",
      error: error.message,
    });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    const newArrivals = await Product.findAll({
      where: {
        isNewArrival: true,
      },
      include: [{ model: Category, as: "category" }],
    });

    res.status(200).json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getNewSale = async (req, res) => {
  try {
    const newSale = await Product.findAll({
      where: {
        onSale: true,
      },
      include: [{ model: Category, as: "category" }],
    });

    res.status(200).json(newSale);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addOccasionToProduct = async (req, res) => {
  try {
    const { productId, occasionId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "المنتج غير موجود" });
    }

    const occasion = await Occasion.findByPk(occasionId);
    if (!occasion) {
      return res
        .status(404)
        .json({ success: false, message: "المناسبة غير موجودة" });
    }

    // دالة Sequelize لإضافة مناسبة لمنتج
    await product.addOccasion(occasion);

    res.json({ success: true, message: "تم إضافة المناسبة للمنتج بنجاح" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ أثناء ربط المناسبة بالمنتج",
      error,
    });
  }
};

// إزالة مناسبة من منتج
exports.removeOccasionFromProduct = async (req, res) => {
  try {
    const { productId, occasionId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "المنتج غير موجود" });
    }

    const occasion = await Occasion.findByPk(occasionId);
    if (!occasion) {
      return res
        .status(404)
        .json({ success: false, message: "المناسبة غير موجودة" });
    }

    // دالة Sequelize لإزالة مناسبة من المنتج
    await product.removeOccasion(occasion);

    res.json({ success: true, message: "تم إزالة المناسبة من المنتج" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "خطأ أثناء إزالة المناسبة", error });
  }
};

// جلب المناسبات الخاصة بمنتج
exports.getOccasionsByProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId, {
      include: [{ model: Occasion, as: "occasions" }],
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "المنتج غير موجود" });

    res.json({ success: true, data: product.occasions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "خطأ أثناء جلب المناسبات", error });
  }
};

// جلب المنتجات الخاصة بمناسبة
// في productController.js
exports.getProductsByOccasion = async (req, res) => {
  try {
    const { occasionName } = req.params;

    // ابحث عن المناسبة
    const occasion = await Occasion.findOne({ where: { name: occasionName } });
    if (!occasion) {
      return res
        .status(404)
        .json({ success: false, message: "المناسبة غير موجودة" });
    }

    // اجلب المنتجات المرتبطة بهذه المناسبة
    const products = await occasion.getProducts();
    // أو include: [{ model: Product, ...}] إن أحببت

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ أثناء جلب المنتجات للمناسبة",
      error: error.message,
    });
  }
};
