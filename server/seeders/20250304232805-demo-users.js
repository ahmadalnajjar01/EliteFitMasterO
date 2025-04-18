const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@admin.com",
        password: await bcrypt.hash("12345678", 10),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
