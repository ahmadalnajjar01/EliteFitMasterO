"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Occasion extends Model {
    static associate(models) {
      // One Occasion can have multiple Products
      Occasion.hasMany(models.Product, {
        foreignKey: "occasionId",
        as: "products",
      });
    }
  }

  Occasion.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Occasion",
    }
  );

  return Occasion;
};
