const mongoose = require("mongoose");
const { hashPass } = require("./auth");
const { userSchema, roleSchema } = require("./models/user");
const { productSchema, productCategorySchema } = require("./models/product");
const { shopSchema } = require("./models/shop");
const { reviewSchema } = require("./models/review");
const { siteSchema } = require("./models/site");

const mongoUri = process.env.MONGODB_URI || "mongodb://admin:password@localhost:27017/ecommerce?authSource=admin";

async function seedDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }

  const Role = mongoose.model("Role", roleSchema);
  const User = mongoose.model("User", userSchema);
  const Product = mongoose.model("Product", productSchema);
  const ProductCategory = mongoose.model("ProductCategory", productCategorySchema);
  const Shop = mongoose.model("Shop", shopSchema);
  const Review = mongoose.model("Review", reviewSchema);
  const Site = mongoose.model("Site", siteSchema);

  const roleNames = ["admin", "seller", "user"];

  for (const name of roleNames) {
    const existingRole = await Role.findOne({ name });
    if (!existingRole) {
      await Role.create({ name, users: [] });
    }
  }

  const adminRole = await Role.findOne({ name: "admin" });
  const existingAdmin = await User.findOne({ email: "admin@123" });

  if (!existingAdmin && adminRole) {
    const passwordHash = await hashPass("admin@123");
    const adminUser = await User.create({
      username: "admin",
      email: "admin@123",
      password: passwordHash,
      role: adminRole._id,
      name: "Administrator",
      avatar: "",
      phone: "",
      address: {
        country: "",
        province: "",
        city: "",
        postCode: "",
        street: "",
      },
    });

    await Role.findByIdAndUpdate(
      adminRole._id,
      { $addToSet: { users: adminUser._id } },
      { new: true }
    );

    console.log("Seeded default admin user: admin@123 / admin@123");
  }

  const sellerRole = await Role.findOne({ name: "seller" });
  let seller = await User.findOne({ email: "seller@example.com" });
  if (!seller && sellerRole) {
    seller = await User.create({
      username: "demo-seller",
      email: "seller@example.com",
      password: await hashPass("seller123"),
      role: sellerRole._id,
      name: "Demo Seller",
      address: { country: "Canada", city: "Toronto" },
    });
    await Role.findByIdAndUpdate(sellerRole._id, {
      $addToSet: { users: seller._id },
    });
  }

  let shop = await Shop.findOne({ name: "Northstar Market" });
  if (!shop && seller) {
    shop = await Shop.create({
      name: "Northstar Market",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      email: "seller@example.com",
      description: "Thoughtful everyday goods from independent makers.",
      user: seller._id,
      address: { country: "Canada", city: "Toronto" },
    });
    await User.findByIdAndUpdate(seller._id, { shop: shop._id });
  }

  const categoryDefinitions = ["Home", "Tech", "Apparel"];
  const categories = {};
  for (const name of categoryDefinitions) {
    categories[name] = await ProductCategory.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true }
    );
  }

  if (shop && (await Product.countDocuments()) === 0) {
    const products = await Product.insertMany([
      {
        name: "Ceramic Pour-Over Set",
        price: "42.00",
        description: "A simple stoneware coffee set made for slow mornings.",
        images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900"],
        categories: [categories.Home._id],
        shop: shop._id,
      },
      {
        name: "Wireless Desk Lamp",
        price: "68.00",
        description: "Rechargeable warm light with a clean, compact silhouette.",
        images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900"],
        categories: [categories.Home._id, categories.Tech._id],
        shop: shop._id,
      },
      {
        name: "Everyday Canvas Tote",
        price: "24.00",
        description: "Durable recycled canvas tote with an oversized inner pocket.",
        images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=900"],
        categories: [categories.Apparel._id],
        shop: shop._id,
      },
    ]);

    await Shop.findByIdAndUpdate(shop._id, {
      $addToSet: { products: { $each: products.map((product) => product._id) } },
    });
    for (const category of Object.values(categories)) {
      const matchingProducts = products.filter((product) =>
        product.categories.some((categoryId) => categoryId.equals(category._id))
      );
      await ProductCategory.findByIdAndUpdate(category._id, {
        $addToSet: { products: { $each: matchingProducts.map((product) => product._id) } },
      });
    }
  }

  if ((await Site.countDocuments()) === 0) {
    await Site.create({
      name: "Northstar Market",
      description: "A curated marketplace for useful, beautiful things.",
      keywords: "home, tech, apparel, independent makers",
    });
  }

  if ((await Review.countDocuments()) === 0 && seller) {
    const firstProduct = await Product.findOne();
    const admin = await User.findOne({ email: "admin@123" });
    if (firstProduct && admin) {
      const review = await Review.create({
        rating: 5,
        content: "Beautiful quality and quick delivery.",
        product: firstProduct._id,
        user: admin._id,
      });
      await Product.findByIdAndUpdate(firstProduct._id, {
        $addToSet: { reviews: review._id },
      });
      await User.findByIdAndUpdate(admin._id, {
        $addToSet: { reviews: review._id },
      });
    }
  }
}

module.exports = { seedDatabase };

if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await mongoose.disconnect();
      console.log("Database seed completed.");
    })
    .catch(async (err) => {
      console.error("Database seed failed:", err);
      await mongoose.disconnect();
      process.exit(1);
    });
}
