"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Occasions", [
      { name: "winter", createdAt: new Date(), updatedAt: new Date() },
      { name: "summer", createdAt: new Date(), updatedAt: new Date() },
      { name: "formal", createdAt: new Date(), updatedAt: new Date() },
      { name: "sports", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Occasions", null, {});
  },
};
