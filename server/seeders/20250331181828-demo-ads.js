"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Ads",
      [
        {
          description: "Special offer: 50% off all items this week!",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "New collection arriving next Monday!",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Free shipping on orders over $50",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Ads", null, {});
  },
};
