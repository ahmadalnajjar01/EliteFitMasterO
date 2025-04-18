const { Ad } = require("../models");

const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.findAll();
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAd = async (req, res) => {
  try {
    const [updated] = await Ad.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedAd = await Ad.findByPk(req.params.id);
      return res.json(updatedAd);
    }
    throw new Error("Ad not found");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAds,
  updateAd,
};
