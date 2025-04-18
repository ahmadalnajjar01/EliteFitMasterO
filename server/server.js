require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/CategoriesRoutes");
const userRoutes = require("./routes/userRoutes");
const occasionRoutes = require("./routes/occasionRoutes");
const productsRoutes = require("./routes/productsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const commentRoutes = require("./routes/commentRoutes");
const commentReportRoutes = require("./routes/commentReportRoutes");
const contactMessageRoutes = require("./routes/contactMessageRoutes");
const adsRoutes = require("./routes/adsRoutes");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/users", authRoutes);
app.use("/api", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/api", userRoutes);
app.use("/api/occasion", occasionRoutes);
app.use("/api", productsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", commentRoutes);
app.use("/api/comment-reports", commentReportRoutes);
app.use("/api", contactMessageRoutes);
app.use("/api/ads", adsRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log(" Database connected!");
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });
