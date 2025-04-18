"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Ad extends Model {
    static associate(models) {}
  }

  Ad.init(
    {
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Ad",
      tableName: "Ads",
      freezeTableName: true,
    }
  );

  return Ad;
};
