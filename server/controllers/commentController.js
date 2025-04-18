const { Comment, User, Product } = require("../models");

exports.createComment = async (req, res) => {
  try {
    // Extract fields from req.body
    const { rating, comment, productId } = req.body;
    console.log(rating, comment, productId);

    // Get userId from the decoded JWT (set by authMiddleware)
    const userId = req.user.userId;
    console.log(userId);

    if (!rating || !productId) {
      return res
        .status(400)
        .json({ message: "Rating and product ID are required" });
    }

    // Ensure the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If a file was uploaded, build its URL
    let reviewImage = null;
    if (req.file) {
      reviewImage = `/uploads/reviews/${req.file.filename}`;
    }

    // Create the comment record
    const newComment = await Comment.create({
      userId,
      productId,
      rating,
      comment,
      reviewImage,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};

exports.getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const comments = await Comment.findAll({
      where: { productId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Format each comment to include the user's firstName as "name"
    const formattedComments = comments.map((c) => ({
      id: c.id,
      rating: c.rating,
      comment: c.comment,
      reviewImage: c.reviewImage,
      // Use the associated User's firstName; default to "Anonymous" if not found
      name: c.User ? c.User.firstName : "Anonymous",
      date: c.createdAt,
    }));

    res.status(200).json({
      success: true,
      comments: formattedComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};
