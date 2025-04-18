"use strict";
module.exports = (sequelize, DataTypes) => {
  const CommentReport = sequelize.define(
    "CommentReport",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "reviewed", "dismissed"),
        defaultValue: "pending",
      },
      moderatorNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {}
  );

  CommentReport.associate = function (models) {
    CommentReport.belongsTo(models.User, { foreignKey: "userId" });
    CommentReport.belongsTo(models.Comment, { foreignKey: "commentId" });

    models.User.hasMany(CommentReport, { foreignKey: "userId" });
    models.Comment.hasMany(CommentReport, { foreignKey: "commentId" });
  };

  return CommentReport;
};
