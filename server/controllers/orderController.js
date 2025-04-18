const jwt = require("jsonwebtoken");
const { Order, User } = require("../models"); // Import User model for email lookup
const nodemailer = require("nodemailer");
const JWT_SECRET = process.env.JWT_SECRET;

// Create email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // Get token from header ("Authorization: Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Get order details from request body
    const {
      productIds,
      total,
      size,
      color,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostalCode,
    } = req.body;

    // Validate required fields
    if (
      !productIds ||
      !Array.isArray(productIds) ||
      productIds.length === 0 ||
      !total
    ) {
      return res.status(400).json({
        message: "Missing required fields: productIds (array) and total",
      });
    }

    // Validate shipping details
    if (
      !shippingName ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingPostalCode
    ) {
      return res.status(400).json({
        message: "Missing required shipping fields",
      });
    }

    // Create order
    const newOrder = await Order.create({
      userId,
      productIds,
      total,
      status: "pending",
      size,
      color,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostalCode,
    });

    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// Get total order count
exports.getOrderCount = async (req, res) => {
  try {
    const orderCount = await Order.count();
    res.status(200).json({ success: true, count: orderCount });
  } catch (error) {
    console.error("Error getting order count:", error);
    res.status(500).json({
      success: false,
      message: "Error getting order count",
      error: error.message,
    });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
          as: "user",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Update order status and send email
exports.updateOrderStatus = async (req, res) => {
  try {
    // Verify admin role
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "pending",
      "preparing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Find and update order
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          attributes: ["email"],
          as: "user",
        },
      ],
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    // Send email notification if status changed
    if (previousStatus !== status) {
      await this.sendOrderStatusEmail(order, previousStatus);
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// Helper function to send status email
exports.sendOrderStatusEmail = async (order, previousStatus) => {
  try {
    const statusMessages = {
      pending: "is being processed",
      preparing: "is now being prepared",
      shipped: "has been shipped and is on its way",
      delivered: "has been delivered",
      cancelled: "has been cancelled",
    };

    const mailOptions = {
      from: `"Store Team" <${process.env.EMAIL_USER}>`,
      to: order.user?.email || order.shippingEmail, // Fallback to shipping email if user email not available
      subject: `Your Order #${order.id} Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Hello ${order.shippingName},</p>
          
          <p>Your order <strong>#${
            order.id
          }</strong> status has been updated:</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Previous Status:</strong> ${previousStatus}</p>
            <p><strong>New Status:</strong> ${order.status}</p>
          </div>
          
          <p>${
            statusMessages[order.status] ||
            "The status of your order has been updated."
          }</p>
          
          <p>If you have any questions about your order, please contact our support team.</p>
          
          <p>Thank you for shopping with us!</p>
          
          <p style="margin-top: 30px; color: #777;">
            <strong>The Store Team</strong><br>
            <a href="mailto:support@store.com">support@store.com</a>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status email sent for order ${order.id} to ${mailOptions.to}`);
  } catch (error) {
    console.error("Error sending status email:", error);
    // Email failure shouldn't fail the whole request
  }
};



exports.getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user along with orders and shipping addresses
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Order,
          as: "orders",
          attributes: [
            "id",
            "total",
            "status",
            "createdAt",
            "shippingName",
            "shippingAddress",
            "shippingCity",
            "shippingState",
            "shippingPostalCode",
          ],
          order: [["createdAt", "DESC"]], // Fetch most recent orders first
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};