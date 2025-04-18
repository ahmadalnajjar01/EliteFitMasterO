"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", [
      // ✅ Men's Clothing
      {
        name: "Black Cotton T-Shirt",
        description: "100% cotton classic t-shirt for men",
        price: 15.99,
        image: "mens_tshirt_black.jpg",
        stock: 50,
        categoryId: 1, // Men
        occasionId: 1, // Example: Casual Wear
        isNewArrival: false,
        onSale: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Blue Jeans",
        description: "Comfortable denim jeans for men",
        price: 39.99,
        image: "mens_jeans_blue.jpg",
        stock: 30,
        categoryId: 1,
        occasionId: 2, // Example: Everyday Wear
        isNewArrival: true,
        onSale: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Winter Black Jacket",
        description: "Warm woolen winter jacket for men",
        price: 79.99,
        image: "mens_jacket_black.jpg",
        stock: 20,
        categoryId: 1,
        occasionId: 2, // Example: Winter Wear
        isNewArrival: false,
        onSale: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ✅ Women's Clothing
      {
        name: "Elegant Evening Dress",
        description: "Luxury silk evening dress for women",
        price: 129.99,
        image: "womens_evening_dress.jpg",
        stock: 15,
        categoryId: 2, // Women
        occasionId: 4, // Example: Party Wear
        isNewArrival: true,
        onSale: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pink Silk Blouse",
        description: "Soft and comfortable silk blouse",
        price: 25.99,
        image: "womens_silk_blouse.jpg",
        stock: 35,
        categoryId: 2,
        occasionId: 1, // Example: Casual Wear
        isNewArrival: false,
        onSale: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ✅ Kids' Clothing
      {
        name: "Colorful Kids T-Shirt",
        description: "100% cotton colorful t-shirt for kids",
        price: 10.99,
        image: "kids_tshirt_colored.jpg",
        stock: 50,
        categoryId: 3, // Kids
        occasionId: 3, // Example: Everyday Wear
        isNewArrival: true,
        onSale: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kids Blue Jeans",
        description: "Comfortable and high-quality denim jeans for kids",
        price: 29.99,
        image: "kids_jeans_blue.jpg",
        stock: 30,
        categoryId: 3,
        occasionId: 2, // Example: Everyday Wear
        isNewArrival: false,
        onSale: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ✅ Sale Products
      {
        name: "Men's Discounted Sneakers",
        description: "Comfortable athletic shoes made from synthetic leather",
        price: 45.99,
        image: "mens_sneakers_sale.jpg",
        stock: 25,
        categoryId: 1, // Sale
        occasionId: 2, // Example: Sportswear
        isNewArrival: false,
        onSale: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Women's Leather Handbag - 40% Off",
        description: "Elegant handbag for all occasions",
        price: 59.99,
        image: "womens_handbag_sale.jpg",
        stock: 15,
        categoryId: 2,
        occasionId: 3, // Example: Party Wear
        isNewArrival: false,
        onSale: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ✅ New Arrivals
      {
        name: "Stylish Men's Watch",
        description: "Luxury waterproof watch with an elegant design",
        price: 99.99,
        image: "mens_watch_new.jpg",
        stock: 10,
        categoryId: 1, // New Arrivals
        occasionId: 1, // Example: Formal Wear
        isNewArrival: true,
        onSale: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "New Women's Sunglasses",
        description: "UV-protected sunglasses",
        price: 35.99,
        image: "womens_sunglasses_new.jpg",
        stock: 20,
        categoryId: 2,
        occasionId: 2, // Example: Summer Wear
        isNewArrival: true,
        onSale: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
