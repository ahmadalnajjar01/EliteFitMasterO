// models/comment.js
"use strict";
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reviewImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {}
  );

  Comment.associate = function (models) {
    // Establish relationships
    Comment.belongsTo(models.User, { foreignKey: "userId" });
    Comment.belongsTo(models.Product, { foreignKey: "productId" });
    models.User.hasMany(Comment, { foreignKey: "userId" });
    
  };

  return Comment;
};
