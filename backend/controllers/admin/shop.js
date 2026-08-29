var mongoose = require("mongoose");
var { shopSchema } = require("../../models/shop");

const mongoUri = process.env.MONGODB_URI || "mongodb://admin:password@localhost:27017/ecommerce";
mongoose.connect(mongoUri);
const Shop = mongoose.model("Shop", shopSchema);

// Shop Management ===================================================
async function listShop(req, res, next) {
  res.json(await Shop.find({}).populate("user", "username"));
}

async function showShop(req, res, next) {
  res.json(
    await Shop.findById(req.query.shopID)
  );
}

async function deleteShop(req, res, next) {
  res.json(await Shop.findByIdAndDelete(req.query.id));
}

module.exports = {
  listShop,
  showShop,
  deleteShop,
};
