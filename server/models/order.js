"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  Order.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      size: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      color: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      shippingName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingCity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingState: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingPostalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  return Order;
};
