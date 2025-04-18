const { User } = require("../models");

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: {
        role: "customer",
      },
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

exports.getCustomerCount = async (req, res) => {
  try {
    const count = await User.count({
      where: {
        role: "customer",
      },
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Error counting customers",
      error: error.message,
    });
  }
};
