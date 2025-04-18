module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      productIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
      },
      size: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      color: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      total: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
      },
      shippingName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shippingAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shippingCity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shippingState: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shippingPostalCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Orders");
  },
};
