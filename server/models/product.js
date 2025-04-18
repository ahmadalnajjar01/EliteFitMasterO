"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // Product belongs to a single Category
      Product.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });

      // Product belongs to a single Occasion
      Product.belongsTo(models.Occasion, {
        foreignKey: "occasionId",
        as: "occasion",
      });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isNewArrival: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      onSale: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      occasionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Occasions",
          key: "id",
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      timestamps: true,
      paranoid: true,
    }
  );

  return Product;
};
