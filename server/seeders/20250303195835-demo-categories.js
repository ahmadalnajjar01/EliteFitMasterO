"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categories", [
      { name: "Men", createdAt: new Date(), updatedAt: new Date() },
      { name: "Women", createdAt: new Date(), updatedAt: new Date() },
      { name: "Kids", createdAt: new Date(), updatedAt: new Date() },
      { name: "Sale", createdAt: new Date(), updatedAt: new Date() }, // ✅ فئة التخفيضات
      { name: "New Arrivals", createdAt: new Date(), updatedAt: new Date() }, // ✅ فئة الوصولات الجديدة
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
